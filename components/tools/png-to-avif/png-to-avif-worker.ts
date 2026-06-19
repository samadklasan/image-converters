/// <reference lib="webworker" />

import { encode } from "@jsquash/avif";

const pngToAvifAcceptedMimeTypes = ["image/png"] as const;
const pngToAvifMaxUploadBytes = 50 * 1024 * 1024;
const pngToAvifMaxUploadMegabytes = Math.floor(
  pngToAvifMaxUploadBytes / (1024 * 1024),
);
const pngToAvifMaxInputPixels = 40_000_000;
const pngToAvifOutputQuality = 60;

function isPngToAvifMimeType(value: string) {
  return pngToAvifAcceptedMimeTypes.includes(
    value as (typeof pngToAvifAcceptedMimeTypes)[number],
  );
}

function isPngFileName(value: string) {
  return /\.png$/i.test(value);
}

function getPngToAvifDownloadName(value: string) {
  const baseName = value.replace(/\.[^.]+$/, "").trim() || "converted-image";
  const safeBaseName = baseName
    .replace(/[^a-z0-9-_]+/gi, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return `${safeBaseName || "converted-image"}.avif`;
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

  if (width * height > pngToAvifMaxInputPixels) {
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
    const encodedAvif = await encode(imageData, {
      quality: pngToAvifOutputQuality,
    });
    const transferableBytes = new Uint8Array(encodedAvif);
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
