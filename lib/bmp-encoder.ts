import { applyPalette, quantize } from "gifenc";

type RgbaInput = {
  data: Uint8Array | Uint8ClampedArray;
  height: number;
  width: number;
};

const bmpFileHeaderSize = 14;
const bmpInfoHeaderSize = 40;
const bmpPaletteColorCount = 256;
const bmpPaletteEntrySize = 4;
const bmpBitsPerPixel = 8;
const bmpColorTableSize = bmpPaletteColorCount * bmpPaletteEntrySize;
const bmpHeaderSize = bmpFileHeaderSize + bmpInfoHeaderSize + bmpColorTableSize;

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

export function encodeBmpFromRgba({ data, height, width }: RgbaInput) {
  if (width <= 0 || height <= 0) {
    throw new Error("The uploaded image has invalid dimensions.");
  }

  if (data.length < width * height * 4) {
    throw new Error("Unable to prepare pixel data for BMP conversion.");
  }

  const flattenedRgba = flattenRgbaOnWhite(data);
  const palette = quantize(flattenedRgba, bmpPaletteColorCount, {
    format: "rgb565",
  });
  const indexedPixels = applyPalette(flattenedRgba, palette, "rgb565");
  const rowStride = Math.ceil(width / 4) * 4;
  const pixelArraySize = rowStride * height;
  const fileSize = bmpHeaderSize + pixelArraySize;
  const output = new Uint8Array(fileSize);
  const view = new DataView(output.buffer);

  output[0] = 0x42;
  output[1] = 0x4d;
  view.setUint32(2, fileSize, true);
  view.setUint32(10, bmpHeaderSize, true);
  view.setUint32(14, bmpInfoHeaderSize, true);
  view.setInt32(18, width, true);
  view.setInt32(22, height, true);
  view.setUint16(26, 1, true);
  view.setUint16(28, bmpBitsPerPixel, true);
  view.setUint32(30, 0, true);
  view.setUint32(34, pixelArraySize, true);
  view.setInt32(38, 2835, true);
  view.setInt32(42, 2835, true);
  view.setUint32(46, bmpPaletteColorCount, true);
  view.setUint32(50, bmpPaletteColorCount, true);

  for (let colorIndex = 0; colorIndex < bmpPaletteColorCount; colorIndex += 1) {
    const [red = 0, green = 0, blue = 0] = palette[colorIndex] ?? [];
    const paletteOffset =
      bmpFileHeaderSize + bmpInfoHeaderSize + colorIndex * bmpPaletteEntrySize;

    output[paletteOffset] = blue;
    output[paletteOffset + 1] = green;
    output[paletteOffset + 2] = red;
    output[paletteOffset + 3] = 0;
  }

  for (let row = 0; row < height; row += 1) {
    const sourceRowOffset = (height - row - 1) * width;
    const outputRowOffset = bmpHeaderSize + row * rowStride;

    for (let column = 0; column < width; column += 1) {
      output[outputRowOffset + column] = indexedPixels[sourceRowOffset + column] ?? 0;
    }
  }

  return output;
}
