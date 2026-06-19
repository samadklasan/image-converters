import sharp from "sharp";

const bmpToAvifAcceptedMimeTypes = ["image/bmp","image/x-ms-bmp"] as const;
const bmpToAvifMaxUploadBytes = 50 * 1024 * 1024;
const bmpToAvifMaxUploadMegabytes = Math.floor(
  bmpToAvifMaxUploadBytes / (1024 * 1024),
);
const bmpToAvifMaxInputPixels = 60_000_000;
const bmpToAvifOutputQuality = 60;
function isBmpToAvifMimeType(value: string) {
  return bmpToAvifAcceptedMimeTypes.includes(
    value as (typeof bmpToAvifAcceptedMimeTypes)[number],
  );
}

function isBmpFileName(value: string) {
  return /\.bmp$/i.test(value);
}

function getBmpToAvifDownloadName(value: string) {
  const baseName = value.replace(/.[^.]+$/, "").trim() || "converted-image";
  const safeBaseName = baseName
    .replace(/[^a-z0-9-_]+/gi, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return `${safeBaseName || "converted-image"}.avif`;
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
    return jsonError("Upload a BMP image first.", 400);
  }

  if (uploadedFile.size <= 0) {
    return jsonError("The uploaded file is empty.", 400);
  }

  if (uploadedFile.size > bmpToAvifMaxUploadBytes) {
    return jsonError("This BMP image is too large to convert safely right now.", 413);
  }

  if (
    !isBmpToAvifMimeType(uploadedFile.type) &&
    !isBmpFileName(uploadedFile.name)
  ) {
    return jsonError("Only BMP image uploads are supported.", 400);
  }

  let inputBuffer: Buffer;

  try {
    inputBuffer = Buffer.from(await uploadedFile.arrayBuffer());
  } catch {
    return jsonError("Unable to read the uploaded BMP image.", 400);
  }

  try {
    const image = sharp(inputBuffer, {
      limitInputPixels: bmpToAvifMaxInputPixels,
      sequentialRead: true,
    });
    const metadata = await image.metadata();

    if (String(metadata.format ?? "") !== "bmp") {
      return jsonError("Only BMP image uploads are supported.", 400);
    }

    if (
      typeof metadata.width === "number" &&
      typeof metadata.height === "number" &&
      metadata.width * metadata.height > bmpToAvifMaxInputPixels
    ) {
      return jsonError(
        "This BMP image has dimensions that are too large to convert safely right now.",
        413,
      );
    }

    const convertedBuffer = await image
      .avif({
        quality: bmpToAvifOutputQuality,
      })
      .toBuffer();

    return new Response(new Uint8Array(convertedBuffer), {
      status: 200,
      headers: {
        "Cache-Control": "no-store, max-age=0",
        "Content-Disposition": `attachment; filename="${getBmpToAvifDownloadName(uploadedFile.name)}"`,
        "Content-Type": "image/avif",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("BMP to AVIF conversion failed", error);

    if (error instanceof Error) {
      if (/pixel limit/i.test(error.message)) {
        return jsonError(
          "This BMP image has dimensions that are too large to convert safely right now.",
          413,
        );
      }

      if (/unsupported image format|input buffer|unsupported file format/i.test(error.message)) {
        return jsonError("The uploaded file is not a valid BMP image.", 400);
      }
    }

    return jsonError("Unable to convert this BMP image to AVIF right now.", 500);
  }
}
