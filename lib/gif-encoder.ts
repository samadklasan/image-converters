import { applyPalette, GIFEncoder, quantize } from "gifenc";

type PaletteColor = [number, number, number] | [number, number, number, number];

type RgbaInput = {
  data: Uint8Array | Uint8ClampedArray;
  height: number;
  width: number;
};

type QuantizeFormat = "rgb565" | "rgba4444";

function hasTransparentPixels(data: Uint8Array | Uint8ClampedArray) {
  for (let index = 3; index < data.length; index += 4) {
    if ((data[index] ?? 255) < 255) {
      return true;
    }
  }

  return false;
}

function flattenRgbaOnWhite(data: Uint8Array | Uint8ClampedArray) {
  const output = new Uint8Array(data.length);

  for (let index = 0; index < data.length; index += 4) {
    const alpha = (data[index + 3] ?? 255) / 255;
    const inverseAlpha = 1 - alpha;

    output[index] = Math.round((data[index] ?? 0) * alpha + 255 * inverseAlpha);
    output[index + 1] = Math.round(
      (data[index + 1] ?? 0) * alpha + 255 * inverseAlpha,
    );
    output[index + 2] = Math.round(
      (data[index + 2] ?? 0) * alpha + 255 * inverseAlpha,
    );
    output[index + 3] = 255;
  }

  return output;
}

function buildGifFrame(
  rgba: Uint8Array | Uint8ClampedArray,
  width: number,
  height: number,
  format: QuantizeFormat,
) {
  const palette = quantize(rgba, 256, {
    ...(format === "rgba4444"
      ? {
          clearAlpha: false,
          format,
          oneBitAlpha: true,
        }
      : { format }),
  }) as PaletteColor[];
  const indexedPixels = applyPalette(rgba, palette, format);

  return {
    indexedPixels,
    palette,
  };
}

export function encodeGifFromRgba({ data, height, width }: RgbaInput) {
  if (width <= 0 || height <= 0) {
    throw new Error("The uploaded image has invalid dimensions.");
  }

  if (data.length < width * height * 4) {
    throw new Error("Unable to prepare pixel data for GIF conversion.");
  }

  const preserveTransparency = hasTransparentPixels(data);
  const { indexedPixels, palette } = buildGifFrame(
    preserveTransparency ? data : flattenRgbaOnWhite(data),
    width,
    height,
    preserveTransparency ? "rgba4444" : "rgb565",
  );
  const transparentIndex = preserveTransparency
    ? palette.findIndex((color) => color.length > 3 && color[3] === 0)
    : -1;
  const gif = GIFEncoder();

  if (preserveTransparency && transparentIndex >= 0) {
    gif.writeFrame(indexedPixels, width, height, {
      palette,
      transparent: true,
      transparentIndex,
    });
  } else {
    const flattenedFrame =
      preserveTransparency && transparentIndex < 0
        ? buildGifFrame(flattenRgbaOnWhite(data), width, height, "rgb565")
        : { indexedPixels, palette };

    gif.writeFrame(flattenedFrame.indexedPixels, width, height, {
      palette: flattenedFrame.palette,
    });
  }

  gif.finish();

  return gif.bytes();
}
