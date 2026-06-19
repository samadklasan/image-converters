/// <reference lib="webworker" />

import { encodeBmpFromRgba } from "@/lib/bmp-encoder";

const jpgToBmpAcceptedMimeTypes = ["image/jpeg", "image/jpg"] as const;
const jpgToBmpMaxUploadBytes = 50 * 1024 * 1024;
const jpgToBmpMaxUploadMegabytes = Math.floor(
  jpgToBmpMaxUploadBytes / (1024 * 1024),
);
const jpgToBmpMaxInputPixels = 60_000_000;

function isJpgToBmpMimeType(value: string) {
  return jpgToBmpAcceptedMimeTypes.includes(
    value as (typeof jpgToBmpAcceptedMimeTypes)[number],
  );
}

function isJpgFileName(value: string) {
  return /\.jpe?g$/i.test(value);
}

function getJpgToBmpDownloadName(value: string) {
  const baseName = value.replace(/\.[^.]+$/, "").trim() || "converted-image";
  const safeBaseName = baseName
    .replace(/[^a-z0-9-_]+/gi, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return `${safeBaseName || "converted-image"}.bmp`;
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

      if (bitmap.width * bitmap.height > jpgToBmpMaxInputPixels) {
        throw new Error(
          "This JPG image has dimensions that are too large to convert safely right now.",
        );
      }

      const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
      const context = canvas.getContext("2d", { willReadFrequently: true });

      if (!context) {
        throw new Error("Your browser could not prepare this JPG image.");
      }

      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, bitmap.width, bitmap.height);
      context.drawImage(bitmap, 0, 0, bitmap.width, bitmap.height);
      const imageData = context.getImageData(0, 0, bitmap.width, bitmap.height);

      const transferableBytes = encodeBmpFromRgba(imageData);
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
