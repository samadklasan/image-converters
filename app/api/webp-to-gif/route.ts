import sharp from "sharp";
import { encodeGifFromRgba } from "@/lib/gif-encoder";

const webpToGifAcceptedMimeTypes = ["image/webp"] as const;
const webpToGifMaxUploadBytes = 50 * 1024 * 1024;
const webpToGifMaxUploadMegabytes = Math.floor(
  webpToGifMaxUploadBytes / (1024 * 1024),
);
const webpToGifMaxInputPixels = 60_000_000;
function isWebpToGifMimeType(value: string) {
  return webpToGifAcceptedMimeTypes.includes(
    value as (typeof webpToGifAcceptedMimeTypes)[number],
  );
}

function isWebpFileName(value: string) {
  return /\.webp$/i.test(value);
}

function getWebpToGifDownloadName(value: string) {
  const baseName = value.replace(/.[^.]+$/, "").trim() || "converted-image";
  const safeBaseName = baseName
    .replace(/[^a-z0-9-_]+/gi, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return `${safeBaseName || "converted-image"}.gif`;
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
    return jsonError("Upload a WEBP image first.", 400);
  }

  if (uploadedFile.size <= 0) {
    return jsonError("The uploaded file is empty.", 400);
  }

  if (uploadedFile.size > webpToGifMaxUploadBytes) {
    return jsonError("This WEBP image is too large to convert safely right now.", 413);
  }

  if (
    !isWebpToGifMimeType(uploadedFile.type) &&
    !isWebpFileName(uploadedFile.name)
  ) {
    return jsonError("Only WEBP image uploads are supported.", 400);
  }

  let inputBuffer: Buffer;

  try {
    inputBuffer = Buffer.from(await uploadedFile.arrayBuffer());
  } catch {
    return jsonError("Unable to read the uploaded WEBP image.", 400);
  }

  try {
    const image = sharp(inputBuffer, {
      limitInputPixels: webpToGifMaxInputPixels,
      sequentialRead: true,
    });
    const metadata = await image.metadata();

    if (String(metadata.format ?? "") !== "webp") {
      return jsonError("Only WEBP image uploads are supported.", 400);
    }

    if (
      typeof metadata.width === "number" &&
      typeof metadata.height === "number" &&
      metadata.width * metadata.height > webpToGifMaxInputPixels
    ) {
      return jsonError(
        "This WEBP image has dimensions that are too large to convert safely right now.",
        413,
      );
    }

    const rawOutput = await image
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const convertedBuffer = new Uint8Array(
      encodeGifFromRgba({
        data: rawOutput.data,
        height: rawOutput.info.height,
        width: rawOutput.info.width,
      }),
    );

    return new Response(new Uint8Array(convertedBuffer), {
      status: 200,
      headers: {
        "Cache-Control": "no-store, max-age=0",
        "Content-Disposition": `attachment; filename="${getWebpToGifDownloadName(uploadedFile.name)}"`,
        "Content-Type": "image/gif",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("WEBP to GIF conversion failed", error);

    if (error instanceof Error) {
      if (/pixel limit/i.test(error.message)) {
        return jsonError(
          "This WEBP image has dimensions that are too large to convert safely right now.",
          413,
        );
      }

      if (/unsupported image format|input buffer|unsupported file format/i.test(error.message)) {
        return jsonError("The uploaded file is not a valid WEBP image.", 400);
      }
    }

    return jsonError("Unable to convert this WEBP image to GIF right now.", 500);
  }
}
