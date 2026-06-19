import sharp from "sharp";

const avifToWebpAcceptedMimeTypes = ["image/avif"] as const;
const avifToWebpMaxUploadBytes = 50 * 1024 * 1024;
const avifToWebpMaxUploadMegabytes = Math.floor(
  avifToWebpMaxUploadBytes / (1024 * 1024),
);
const avifToWebpMaxInputPixels = 60_000_000;
const avifToWebpOutputQuality = 75;
function isAvifToWebpMimeType(value: string) {
  return avifToWebpAcceptedMimeTypes.includes(
    value as (typeof avifToWebpAcceptedMimeTypes)[number],
  );
}

function isAvifFileName(value: string) {
  return /\.avif$/i.test(value);
}

function getAvifToWebpDownloadName(value: string) {
  const baseName = value.replace(/.[^.]+$/, "").trim() || "converted-image";
  const safeBaseName = baseName
    .replace(/[^a-z0-9-_]+/gi, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return `${safeBaseName || "converted-image"}.webp`;
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
    return jsonError("Upload a AVIF image first.", 400);
  }

  if (uploadedFile.size <= 0) {
    return jsonError("The uploaded file is empty.", 400);
  }

  if (uploadedFile.size > avifToWebpMaxUploadBytes) {
    return jsonError("This AVIF image is too large to convert safely right now.", 413);
  }

  if (
    !isAvifToWebpMimeType(uploadedFile.type) &&
    !isAvifFileName(uploadedFile.name)
  ) {
    return jsonError("Only AVIF image uploads are supported.", 400);
  }

  let inputBuffer: Buffer;

  try {
    inputBuffer = Buffer.from(await uploadedFile.arrayBuffer());
  } catch {
    return jsonError("Unable to read the uploaded AVIF image.", 400);
  }

  try {
    const image = sharp(inputBuffer, {
      limitInputPixels: avifToWebpMaxInputPixels,
      sequentialRead: true,
    });
    const metadata = await image.metadata();

    if (String(metadata.format ?? "") !== "avif") {
      return jsonError("Only AVIF image uploads are supported.", 400);
    }

    if (
      typeof metadata.width === "number" &&
      typeof metadata.height === "number" &&
      metadata.width * metadata.height > avifToWebpMaxInputPixels
    ) {
      return jsonError(
        "This AVIF image has dimensions that are too large to convert safely right now.",
        413,
      );
    }

    const convertedBuffer = await image
      .webp({
        quality: avifToWebpOutputQuality,
      })
      .toBuffer();

    return new Response(new Uint8Array(convertedBuffer), {
      status: 200,
      headers: {
        "Cache-Control": "no-store, max-age=0",
        "Content-Disposition": `attachment; filename="${getAvifToWebpDownloadName(uploadedFile.name)}"`,
        "Content-Type": "image/webp",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("AVIF to WEBP conversion failed", error);

    if (error instanceof Error) {
      if (/pixel limit/i.test(error.message)) {
        return jsonError(
          "This AVIF image has dimensions that are too large to convert safely right now.",
          413,
        );
      }

      if (/unsupported image format|input buffer|unsupported file format/i.test(error.message)) {
        return jsonError("The uploaded file is not a valid AVIF image.", 400);
      }
    }

    return jsonError("Unable to convert this AVIF image to WEBP right now.", 500);
  }
}
