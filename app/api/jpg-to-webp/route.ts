import { NextRequest } from "next/server";
import sharp from "sharp";

const jpgToWebpAcceptedMimeTypes = ["image/jpeg", "image/jpg"] as const;
const jpgToWebpMaxUploadBytes = 50 * 1024 * 1024;
const jpgToWebpMaxUploadMegabytes = Math.floor(
  jpgToWebpMaxUploadBytes / (1024 * 1024),
);
const jpgToWebpMaxInputPixels = 60_000_000;

const jpgToWebpOutputQuality = 75;

function isJpgToWebpMimeType(value: string) {
  return jpgToWebpAcceptedMimeTypes.includes(
    value as (typeof jpgToWebpAcceptedMimeTypes)[number],
  );
}

function isJpgFileName(value: string) {
  return /\.jpe?g$/i.test(value);
}

function getJpgToWebpDownloadName(value: string) {
  const baseName = value.replace(/\.[^.]+$/, "").trim() || "converted-image";
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

function hasValidJpegSignature(buffer: Uint8Array) {
  return buffer.byteLength >= 3 &&
    buffer[0] === 255 &&
    buffer[1] === 216 &&
    buffer[2] === 255;
}

export async function POST(request: NextRequest) {
  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return jsonError("Invalid upload request.", 400);
  }

  const uploadedFile = formData.get("file");

  if (!(uploadedFile instanceof File)) {
    return jsonError("Upload a JPG image first.", 400);
  }

  if (uploadedFile.size <= 0) {
    return jsonError("The uploaded file is empty.", 400);
  }

  if (uploadedFile.size > jpgToWebpMaxUploadBytes) {
    return jsonError("This JPG is too large to convert safely right now.", 413);
  }

  if (
    !isJpgToWebpMimeType(uploadedFile.type) &&
    !isJpgFileName(uploadedFile.name)
  ) {
    return jsonError("Only JPG image uploads are supported.", 400);
  }

  let inputBuffer: Buffer;

  try {
    inputBuffer = Buffer.from(await uploadedFile.arrayBuffer());
  } catch {
    return jsonError("Unable to read the uploaded JPG image.", 400);
  }

  if (!hasValidJpegSignature(inputBuffer)) {
    return jsonError("The uploaded file is not a valid JPG image.", 400);
  }

  try {
    const image = sharp(inputBuffer, {
      limitInputPixels: jpgToWebpMaxInputPixels,
      sequentialRead: true,
    });
    const metadata = await image.metadata();

    if (metadata.format !== "jpeg") {
      return jsonError("Only JPG image uploads are supported.", 400);
    }

    if (
      typeof metadata.width === "number" &&
      typeof metadata.height === "number" &&
      metadata.width * metadata.height > jpgToWebpMaxInputPixels
    ) {
      return jsonError(
        "This JPG image has dimensions that are too large to convert safely right now.",
        413,
      );
    }

    const convertedBuffer = await image
      .webp({
        quality: jpgToWebpOutputQuality,
      })
      .toBuffer();

    return new Response(new Uint8Array(convertedBuffer), {
      status: 200,
      headers: {
        "Cache-Control": "no-store, max-age=0",
        "Content-Disposition": `attachment; filename="${getJpgToWebpDownloadName(uploadedFile.name)}"`,
        "Content-Type": "image/webp",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("JPG to WEBP conversion failed", error);

    if (error instanceof Error) {
      if (/pixel limit/i.test(error.message)) {
        return jsonError(
          "This JPG image has dimensions that are too large to convert safely right now.",
          413,
        );
      }

      if (/unsupported image format|input buffer/i.test(error.message)) {
        return jsonError("The uploaded file is not a valid JPG image.", 400);
      }
    }

    return jsonError("Unable to convert this JPG image to WEBP right now.", 500);
  }
}
