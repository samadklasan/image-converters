import sharp from "sharp";

const tiffToJpgAcceptedMimeTypes = ["image/tiff"] as const;
const tiffToJpgMaxUploadBytes = 50 * 1024 * 1024;
const tiffToJpgMaxUploadMegabytes = Math.floor(
  tiffToJpgMaxUploadBytes / (1024 * 1024),
);
const tiffToJpgMaxInputPixels = 60_000_000;
const tiffToJpgOutputQuality = 85;
function isTiffToJpgMimeType(value: string) {
  return tiffToJpgAcceptedMimeTypes.includes(
    value as (typeof tiffToJpgAcceptedMimeTypes)[number],
  );
}

function isTiffFileName(value: string) {
  return /\.tiff?$/i.test(value);
}

function getTiffToJpgDownloadName(value: string) {
  const baseName = value.replace(/.[^.]+$/, "").trim() || "converted-image";
  const safeBaseName = baseName
    .replace(/[^a-z0-9-_]+/gi, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return `${safeBaseName || "converted-image"}.jpg`;
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

  if (uploadedFile.size > tiffToJpgMaxUploadBytes) {
    return jsonError("This TIFF image is too large to convert safely right now.", 413);
  }

  if (
    !isTiffToJpgMimeType(uploadedFile.type) &&
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
      limitInputPixels: tiffToJpgMaxInputPixels,
      sequentialRead: true,
    });
    const metadata = await image.metadata();

    if (String(metadata.format ?? "") !== "tiff") {
      return jsonError("Only TIFF image uploads are supported.", 400);
    }

    if (
      typeof metadata.width === "number" &&
      typeof metadata.height === "number" &&
      metadata.width * metadata.height > tiffToJpgMaxInputPixels
    ) {
      return jsonError(
        "This TIFF image has dimensions that are too large to convert safely right now.",
        413,
      );
    }

    const convertedBuffer = await image
      .flatten({ background: "#ffffff" })
      .jpeg({
        mozjpeg: true,
        progressive: true,
        quality: tiffToJpgOutputQuality,
      })
      .toBuffer();

    return new Response(new Uint8Array(convertedBuffer), {
      status: 200,
      headers: {
        "Cache-Control": "no-store, max-age=0",
        "Content-Disposition": `attachment; filename="${getTiffToJpgDownloadName(uploadedFile.name)}"`,
        "Content-Type": "image/jpeg",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("TIFF to JPG conversion failed", error);

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

    return jsonError("Unable to convert this TIFF image to JPG right now.", 500);
  }
}
