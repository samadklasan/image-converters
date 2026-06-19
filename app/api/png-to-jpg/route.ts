import { NextRequest } from "next/server";
import sharp from "sharp";

const pngToJpgAcceptedMimeTypes = ["image/png"] as const;
const pngToJpgMaxUploadBytes = 50 * 1024 * 1024;
const pngToJpgMaxUploadMegabytes = Math.floor(
  pngToJpgMaxUploadBytes / (1024 * 1024),
);
const pngToJpgMaxInputPixels = 40_000_000;
const pngToJpgOutputQuality = 85;

function isPngToJpgMimeType(value: string) {
  return pngToJpgAcceptedMimeTypes.includes(
    value as (typeof pngToJpgAcceptedMimeTypes)[number],
  );
}

function isPngFileName(value: string) {
  return /\.png$/i.test(value);
}

function getPngToJpgDownloadName(value: string) {
  const baseName = value.replace(/\.[^.]+$/, "").trim() || "converted-image";
  const safeBaseName = baseName
    .replace(/[^a-z0-9-_]+/gi, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return `${safeBaseName || "converted-image"}.jpg`;
}

export const runtime = "nodejs";

const pngSignature = Uint8Array.from([137, 80, 78, 71, 13, 10, 26, 10]);

function jsonError(message: string, status: number) {
  return Response.json({ message }, { status });
}

function hasValidPngSignature(buffer: Uint8Array) {
  if (buffer.byteLength < pngSignature.length) {
    return false;
  }

  return pngSignature.every((byte, index) => buffer[index] === byte);
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
    return jsonError("Upload a PNG image first.", 400);
  }

  if (uploadedFile.size <= 0) {
    return jsonError("The uploaded file is empty.", 400);
  }

  if (uploadedFile.size > pngToJpgMaxUploadBytes) {
    return jsonError("This PNG is too large to convert safely right now.", 413);
  }

  if (
    !isPngToJpgMimeType(uploadedFile.type) &&
    !isPngFileName(uploadedFile.name)
  ) {
    return jsonError("Only PNG image uploads are supported.", 400);
  }

  let inputBuffer: Buffer;

  try {
    inputBuffer = Buffer.from(await uploadedFile.arrayBuffer());
  } catch {
    return jsonError("Unable to read the uploaded PNG image.", 400);
  }

  if (!hasValidPngSignature(inputBuffer)) {
    return jsonError("The uploaded file is not a valid PNG image.", 400);
  }

  try {
    const image = sharp(inputBuffer, {
      limitInputPixels: pngToJpgMaxInputPixels,
      sequentialRead: true,
    });
    const metadata = await image.metadata();

    if (metadata.format !== "png") {
      return jsonError("Only PNG image uploads are supported.", 400);
    }

    if (
      typeof metadata.width === "number" &&
      typeof metadata.height === "number" &&
      metadata.width * metadata.height > pngToJpgMaxInputPixels
    ) {
      return jsonError(
        "This PNG image has dimensions that are too large to convert safely right now.",
        413,
      );
    }

    const convertedBuffer = await image
      .flatten({ background: "#ffffff" })
      .jpeg({
        quality: pngToJpgOutputQuality,
        mozjpeg: true,
        progressive: true,
      })
      .toBuffer();

    return new Response(new Uint8Array(convertedBuffer), {
      status: 200,
      headers: {
        "Cache-Control": "no-store, max-age=0",
        "Content-Disposition": `attachment; filename="${getPngToJpgDownloadName(uploadedFile.name)}"`,
        "Content-Type": "image/jpeg",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("PNG to JPG conversion failed", error);

    if (error instanceof Error) {
      if (/pixel limit/i.test(error.message)) {
        return jsonError(
          "This PNG image has dimensions that are too large to convert safely right now.",
          413,
        );
      }

      if (/unsupported image format|input buffer/i.test(error.message)) {
        return jsonError("The uploaded file is not a valid PNG image.", 400);
      }
    }

    return jsonError("Unable to convert this PNG image right now.", 500);
  }
}
