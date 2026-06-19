/// <reference lib="webworker" />

import { encode } from "@jsquash/webp";

const pngToWebpAcceptedMimeTypes = ["image/png"] as const;
const pngToWebpMaxUploadBytes = 50 * 1024 * 1024;
const pngToWebpMaxUploadMegabytes = Math.floor(
  pngToWebpMaxUploadBytes / (1024 * 1024),
);
const pngToWebpMaxInputPixels = 40_000_000;
const pngToWebpOutputQuality = 75;

function isPngToWebpMimeType(value: string) {
  return pngToWebpAcceptedMimeTypes.includes(
    value as (typeof pngToWebpAcceptedMimeTypes)[number],
  );
}

function isPngFileName(value: string) {
  return /\.png$/i.test(value);
}

function getPngToWebpDownloadName(value: string) {
  const baseName = value.replace(/\.[^.]+$/, "").trim() || "converted-image";
  const safeBaseName = baseName
    .replace(/[^a-z0-9-_]+/gi, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return `${safeBaseName || "converted-image"}.webp`;
}

/// <reference lib="webworker" />

type ConvertMessage = {
  file: File;
  requestId: string;
  type: "convert";
};

type SuccessMessage = {
  buffer: ArrayBuffer;
  requestId: string;
  type: "success";
};

type ErrorMessage = {
  message: string;
  requestId: string;
  type: "error";
};

function drawSourceToImageData(
  source: CanvasImageSource,
  width: number,
  height: number,
) {
  if (width <= 0 || height <= 0) {
    throw new Error("The uploaded PNG image has invalid dimensions.");
  }

  if (width * height > pngToWebpMaxInputPixels) {
    throw new Error(
      "This PNG image has dimensions that are too large to convert safely right now.",
    );
  }

  const canvas = new OffscreenCanvas(width, height);
  const context = canvas.getContext("2d", { willReadFrequently: true });

  if (!context) {
    throw new Error("Your browser could not prepare this PNG image.");
  }

  context.clearRect(0, 0, width, height);
  context.drawImage(source, 0, 0, width, height);

  return context.getImageData(0, 0, width, height);
}

async function fileToImageData(file: File) {
  const bitmap = await createImageBitmap(file);

  try {
    return drawSourceToImageData(bitmap, bitmap.width, bitmap.height);
  } finally {
    bitmap.close();
  }
}

self.onmessage = async (event: MessageEvent<ConvertMessage>) => {
  if (event.data.type !== "convert") {
    return;
  }

  const { file, requestId } = event.data;

  try {
    const imageData = await fileToImageData(file);
    const encodedWebp = await encode(imageData, {
      quality: pngToWebpOutputQuality,
    });
    const transferableBytes = new Uint8Array(encodedWebp);
    const message: SuccessMessage = {
      buffer: transferableBytes.buffer,
      requestId,
      type: "success",
    };

    self.postMessage(message, [transferableBytes.buffer]);
  } catch (error) {
    const message: ErrorMessage = {
      message:
        error instanceof Error
          ? error.message
          : "Unable to convert this PNG image right now.",
      requestId,
      type: "error",
    };

    self.postMessage(message);
  }
};

export {};
