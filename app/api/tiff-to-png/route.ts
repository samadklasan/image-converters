import sharp from "sharp";

const tiffToPngAcceptedMimeTypes = ["image/tiff"] as const;
const tiffToPngMaxUploadBytes = 50 * 1024 * 1024;
const tiffToPngMaxUploadMegabytes = Math.floor(
  tiffToPngMaxUploadBytes / (1024 * 1024),
);
const tiffToPngMaxInputPixels = 60_000_000;
function isTiffToPngMimeType(value: string) {
  return tiffToPngAcceptedMimeTypes.includes(
    value as (typeof tiffToPngAcceptedMimeTypes)[number],
  );
}

function isTiffFileName(value: string) {
  return /\.tiff?$/i.test(value);
}

function getTiffToPngDownloadName(value: string) {
  const baseName = value.replace(/.[^.]+$/, "").trim() || "converted-image";
  const safeBaseName = baseName
    .replace(/[^a-z0-9-_]+/gi, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return `${safeBaseName || "converted-image"}.png`;
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
    return jsonError("Upload a TIFF image first.", 400);
  }

  if (uploadedFile.size <= 0) {
    return jsonError("The uploaded file is empty.", 400);
  }

  if (uploadedFile.size > tiffToPngMaxUploadBytes) {
    return jsonError("This TIFF image is too large to convert safely right now.", 413);
  }

  if (
    !isTiffToPngMimeType(uploadedFile.type) &&
    !isTiffFileName(uploadedFile.name)
  ) {
    return jsonError("Only TIFF image uploads are supported.", 400);
  }

  let inputBuffer: Buffer;

  try {
    inputBuffer = Buffer.from(await uploadedFile.arrayBuffer());
  } catch {
    return jsonError("Unable to read the uploaded TIFF image.", 400);
  }

  try {
    const image = sharp(inputBuffer, {
      limitInputPixels: tiffToPngMaxInputPixels,
      sequentialRead: true,
    });
    const metadata = await image.metadata();

    if (String(metadata.format ?? "") !== "tiff") {
      return jsonError("Only TIFF image uploads are supported.", 400);
    }

    if (
      typeof metadata.width === "number" &&
      typeof metadata.height === "number" &&
      metadata.width * metadata.height > tiffToPngMaxInputPixels
    ) {
      return jsonError(
        "This TIFF image has dimensions that are too large to convert safely right now.",
        413,
      );
    }

    const convertedBuffer = await image.png().toBuffer();

    return new Response(new Uint8Array(convertedBuffer), {
      status: 200,
      headers: {
        "Cache-Control": "no-store, max-age=0",
        "Content-Disposition": `attachment; filename="${getTiffToPngDownloadName(uploadedFile.name)}"`,
        "Content-Type": "image/png",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("TIFF to PNG conversion failed", error);

    if (error instanceof Error) {
      if (/pixel limit/i.test(error.message)) {
        return jsonError(
          "This TIFF image has dimensions that are too large to convert safely right now.",
          413,
        );
      }

      if (/unsupported image format|input buffer|unsupported file format/i.test(error.message)) {
        return jsonError("The uploaded file is not a valid TIFF image.", 400);
      }
    }

    return jsonError("Unable to convert this TIFF image to PNG right now.", 500);
  }
}
