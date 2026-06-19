/// <reference lib="webworker" />

import { encode } from "@jsquash/avif";

const jpgToAvifAcceptedMimeTypes = ["image/jpeg", "image/jpg"] as const;
const jpgToAvifMaxUploadBytes = 50 * 1024 * 1024;
const jpgToAvifMaxUploadMegabytes = Math.floor(
  jpgToAvifMaxUploadBytes / (1024 * 1024),
);
const jpgToAvifMaxInputPixels = 60_000_000;
const jpgToAvifOutputQuality = 60;

function isJpgToAvifMimeType(value: string) {
  return jpgToAvifAcceptedMimeTypes.includes(
    value as (typeof jpgToAvifAcceptedMimeTypes)[number],
  );
}

function isJpgFileName(value: string) {
  return /\.jpe?g$/i.test(value);
}

function getJpgToAvifDownloadName(value: string) {
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

async function fileToImageBitmap(file: File) {
  return createImageBitmap(file);
}

self.onmessage = async (event: MessageEvent<ConvertMessage>) => {
  if (event.data.type !== "convert") {
    return;
  }

  const { file, requestId } = event.data;

  try {
    const bitmap = await fileToImageBitmap(file);

    try {
      if (bitmap.width <= 0 || bitmap.height <= 0) {
        throw new Error("The uploaded JPG image has invalid dimensions.");
      }

      if (bitmap.width * bitmap.height > jpgToAvifMaxInputPixels) {
        throw new Error(
          "This JPG image has dimensions that are too large to convert safely right now.",
        );
      }

      const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
      const context = canvas.getContext("2d", { willReadFrequently: true });

      if (!context) {
        throw new Error("Your browser could not prepare this JPG image.");
      }

      context.clearRect(0, 0, bitmap.width, bitmap.height);
      context.drawImage(bitmap, 0, 0, bitmap.width, bitmap.height);
      const imageData = context.getImageData(0, 0, bitmap.width, bitmap.height);

      const encodedAvif = await encode(imageData, {
      quality: jpgToAvifOutputQuality,
    });
    const transferableBytes = new Uint8Array(encodedAvif);
      const message: SuccessMessage = {
        buffer: transferableBytes.buffer,
        requestId,
        type: "success",
      };

      self.postMessage(message, [transferableBytes.buffer]);
    } finally {
      bitmap.close();
    }
  } catch (error) {
    const message: ErrorMessage = {
      message:
        error instanceof Error
          ? error.message
          : "Unable to convert this JPG image right now.",
      requestId,
      type: "error",
    };

    self.postMessage(message);
  }
};

export {};
