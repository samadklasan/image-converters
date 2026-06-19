import sharp from "sharp";

const gifToTiffAcceptedMimeTypes = ["image/gif"] as const;
const gifToTiffMaxUploadBytes = 50 * 1024 * 1024;
const gifToTiffMaxUploadMegabytes = Math.floor(
  gifToTiffMaxUploadBytes / (1024 * 1024),
);
const gifToTiffMaxInputPixels = 60_000_000;
function isGifToTiffMimeType(value: string) {
  return gifToTiffAcceptedMimeTypes.includes(
    value as (typeof gifToTiffAcceptedMimeTypes)[number],
  );
}

function isGifFileName(value: string) {
  return /\.gif$/i.test(value);
}

function getGifToTiffDownloadName(value: string) {
  const baseName = value.replace(/.[^.]+$/, "").trim() || "converted-image";
  const safeBaseName = baseName
    .replace(/[^a-z0-9-_]+/gi, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return `${safeBaseName || "converted-image"}.tiff`;
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

  if (uploadedFile.size > gifToTiffMaxUploadBytes) {
    return jsonError("This GIF image is too large to convert safely right now.", 413);
  }

  if (
    !isGifToTiffMimeType(uploadedFile.type) &&
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
      limitInputPixels: gifToTiffMaxInputPixels,
      sequentialRead: true,
    });
    const metadata = await image.metadata();

    if (String(metadata.format ?? "") !== "gif") {
      return jsonError("Only GIF image uploads are supported.", 400);
    }

    if (
      typeof metadata.width === "number" &&
      typeof metadata.height === "number" &&
      metadata.width * metadata.height > gifToTiffMaxInputPixels
    ) {
      return jsonError(
        "This GIF image has dimensions that are too large to convert safely right now.",
        413,
      );
    }

    const convertedBuffer = await image
      .tiff({
        compression: "lzw",
        predictor: "horizontal",
        quality: 90,
      })
      .toBuffer();

    return new Response(new Uint8Array(convertedBuffer), {
      status: 200,
      headers: {
        "Cache-Control": "no-store, max-age=0",
        "Content-Disposition": `attachment; filename="${getGifToTiffDownloadName(uploadedFile.name)}"`,
        "Content-Type": "image/tiff",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("GIF to TIFF conversion failed", error);

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

    return jsonError("Unable to convert this GIF image to TIFF right now.", 500);
  }
}
