import sharp from "sharp";

const gifToJpgAcceptedMimeTypes = ["image/gif"] as const;
const gifToJpgMaxUploadBytes = 50 * 1024 * 1024;
const gifToJpgMaxUploadMegabytes = Math.floor(
  gifToJpgMaxUploadBytes / (1024 * 1024),
);
const gifToJpgMaxInputPixels = 60_000_000;
const gifToJpgOutputQuality = 85;
function isGifToJpgMimeType(value: string) {
  return gifToJpgAcceptedMimeTypes.includes(
    value as (typeof gifToJpgAcceptedMimeTypes)[number],
  );
}

function isGifFileName(value: string) {
  return /\.gif$/i.test(value);
}

function getGifToJpgDownloadName(value: string) {
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
    return jsonError("Upload a GIF image first.", 400);
  }

  if (uploadedFile.size <= 0) {
    return jsonError("The uploaded file is empty.", 400);
  }

  if (uploadedFile.size > gifToJpgMaxUploadBytes) {
    return jsonError("This GIF image is too large to convert safely right now.", 413);
  }

  if (
    !isGifToJpgMimeType(uploadedFile.type) &&
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
      limitInputPixels: gifToJpgMaxInputPixels,
      sequentialRead: true,
    });
    const metadata = await image.metadata();

    if (String(metadata.format ?? "") !== "gif") {
      return jsonError("Only GIF image uploads are supported.", 400);
    }

    if (
      typeof metadata.width === "number" &&
      typeof metadata.height === "number" &&
      metadata.width * metadata.height > gifToJpgMaxInputPixels
    ) {
      return jsonError(
        "This GIF image has dimensions that are too large to convert safely right now.",
        413,
      );
    }

    const convertedBuffer = await image
      .flatten({ background: "#ffffff" })
      .jpeg({
        mozjpeg: true,
        progressive: true,
        quality: gifToJpgOutputQuality,
      })
      .toBuffer();

    return new Response(new Uint8Array(convertedBuffer), {
      status: 200,
      headers: {
        "Cache-Control": "no-store, max-age=0",
        "Content-Disposition": `attachment; filename="${getGifToJpgDownloadName(uploadedFile.name)}"`,
        "Content-Type": "image/jpeg",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("GIF to JPG conversion failed", error);

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

    return jsonError("Unable to convert this GIF image to JPG right now.", 500);
  }
}
