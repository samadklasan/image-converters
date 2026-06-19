import sharp from "sharp";
import { encodeBmpFromRgba } from "@/lib/bmp-encoder";

const gifToBmpAcceptedMimeTypes = ["image/gif"] as const;
const gifToBmpMaxUploadBytes = 50 * 1024 * 1024;
const gifToBmpMaxUploadMegabytes = Math.floor(
  gifToBmpMaxUploadBytes / (1024 * 1024),
);
const gifToBmpMaxInputPixels = 60_000_000;
function isGifToBmpMimeType(value: string) {
  return gifToBmpAcceptedMimeTypes.includes(
    value as (typeof gifToBmpAcceptedMimeTypes)[number],
  );
}

function isGifFileName(value: string) {
  return /\.gif$/i.test(value);
}

function getGifToBmpDownloadName(value: string) {
  const baseName = value.replace(/.[^.]+$/, "").trim() || "converted-image";
  const safeBaseName = baseName
    .replace(/[^a-z0-9-_]+/gi, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return `${safeBaseName || "converted-image"}.bmp`;
}

export const runtime = "nodejs";

function jsonError(message: string, status: number) {
  return Response.json({ message }, { status });
}

export async function POST(request: Request) {
  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return jsonError("Invalid upload request.", 400);
  }

  const uploadedFile = formData.get("file");

  if (!(uploadedFile instanceof File)) {
    return jsonError("Upload a GIF image first.", 400);
  }

  if (uploadedFile.size <= 0) {
    return jsonError("The uploaded file is empty.", 400);
  }

  if (uploadedFile.size > gifToBmpMaxUploadBytes) {
    return jsonError("This GIF image is too large to convert safely right now.", 413);
  }

  if (
    !isGifToBmpMimeType(uploadedFile.type) &&
    !isGifFileName(uploadedFile.name)
  ) {
    return jsonError("Only GIF image uploads are supported.", 400);
  }

  let inputBuffer: Buffer;

  try {
    inputBuffer = Buffer.from(await uploadedFile.arrayBuffer());
  } catch {
    return jsonError("Unable to read the uploaded GIF image.", 400);
  }

  try {
    const image = sharp(inputBuffer, {
      limitInputPixels: gifToBmpMaxInputPixels,
      sequentialRead: true,
    });
    const metadata = await image.metadata();

    if (String(metadata.format ?? "") !== "gif") {
      return jsonError("Only GIF image uploads are supported.", 400);
    }

    if (
      typeof metadata.width === "number" &&
      typeof metadata.height === "number" &&
      metadata.width * metadata.height > gifToBmpMaxInputPixels
    ) {
      return jsonError(
        "This GIF image has dimensions that are too large to convert safely right now.",
        413,
      );
    }

    const rawOutput = await image
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const convertedBuffer = encodeBmpFromRgba({
      data: rawOutput.data,
      height: rawOutput.info.height,
      width: rawOutput.info.width,
    });

    return new Response(new Uint8Array(convertedBuffer), {
      status: 200,
      headers: {
        "Cache-Control": "no-store, max-age=0",
        "Content-Disposition": `attachment; filename="${getGifToBmpDownloadName(uploadedFile.name)}"`,
        "Content-Type": "image/bmp",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("GIF to BMP conversion failed", error);

    if (error instanceof Error) {
      if (/pixel limit/i.test(error.message)) {
        return jsonError(
          "This GIF image has dimensions that are too large to convert safely right now.",
          413,
        );
      }

      if (/unsupported image format|input buffer|unsupported file format/i.test(error.message)) {
        return jsonError("The uploaded file is not a valid GIF image.", 400);
      }
    }

    return jsonError("Unable to convert this GIF image to BMP right now.", 500);
  }
}
