import { encodeWithWasm } from "./codecs";
import type { ImageFormat, RasterImageFormat, WasmImageFormat } from "./types";

export async function encodeImageData(
  imageData: ImageData,
  target: ImageFormat,
  quality: number,
): Promise<Blob> {
  if (isWasmFormat(target)) {
    const bytes = await encodeWithWasm(imageData, target, quality);
    return new Blob([bytes], { type: target });
  }

  switch (target) {
    case "image/bmp":
      return new Blob([encodeBmp(imageData)], { type: target });
    case "image/tiff":
      return new Blob([await encodeTiff(imageData)], { type: target });
    case "image/gif":
      return new Blob([copyToArrayBuffer(await encodeGif(imageData))], {
        type: target,
      });
    case "image/x-icon":
      return new Blob([await encodeIco(await resizeForIcon(imageData))], {
        type: target,
      });
    case "image/heic":
      return encodeHeic(imageData);
    case "image/svg+xml":
      return new Blob([await encodeSvgWrapper(imageData)], { type: target });
  }
}

async function encodeHeic(imageData: ImageData): Promise<Blob> {
  const codec = await import("elheif");
  await codec.ensureInitialized();
  const rgba = new Uint8Array(
    imageData.data.buffer,
    imageData.data.byteOffset,
    imageData.data.byteLength,
  );
  const result = codec.jsEncodeImage(rgba, imageData.width, imageData.height);
  if (result.err || result.data.byteLength === 0) {
    throw new Error(result.err || "HEIC encoding failed");
  }
  const bytes = new Uint8Array(result.data.byteLength);
  bytes.set(result.data);
  return new Blob([bytes], { type: "image/heic" });
}

export async function encodeRasterImageData(
  imageData: ImageData,
  target: RasterImageFormat,
  quality: number,
): Promise<Blob> {
  return encodeImageData(imageData, target, quality);
}

function isWasmFormat(target: ImageFormat): target is WasmImageFormat {
  return (
    target === "image/jpeg" ||
    target === "image/png" ||
    target === "image/webp" ||
    target === "image/avif" ||
    target === "image/jxl"
  );
}

function encodeBmp({ data, width, height }: ImageData): ArrayBuffer {
  const rowStride = Math.ceil((width * 3) / 4) * 4;
  const pixelBytes = rowStride * height;
  const buffer = new ArrayBuffer(54 + pixelBytes);
  const view = new DataView(buffer);
  view.setUint8(0, 0x42);
  view.setUint8(1, 0x4d);
  view.setUint32(2, buffer.byteLength, true);
  view.setUint32(10, 54, true);
  view.setUint32(14, 40, true);
  view.setInt32(18, width, true);
  view.setInt32(22, height, true);
  view.setUint16(26, 1, true);
  view.setUint16(28, 24, true);
  view.setUint32(34, pixelBytes, true);

  for (let y = 0; y < height; y += 1) {
    const sourceRow = height - 1 - y;
    const destination = 54 + y * rowStride;
    for (let x = 0; x < width; x += 1) {
      const source = (sourceRow * width + x) * 4;
      const alpha = data[source + 3] / 255;
      const red = Math.round(data[source] * alpha + 255 * (1 - alpha));
      const green = Math.round(data[source + 1] * alpha + 255 * (1 - alpha));
      const blue = Math.round(data[source + 2] * alpha + 255 * (1 - alpha));
      const pixel = destination + x * 3;
      view.setUint8(pixel, blue);
      view.setUint8(pixel + 1, green);
      view.setUint8(pixel + 2, red);
    }
  }
  return buffer;
}

async function encodeTiff(imageData: ImageData): Promise<ArrayBuffer> {
  const module = await import("utif2");
  const encoder = module.default ?? module;
  const rgba = new Uint8Array(
    imageData.data.buffer,
    imageData.data.byteOffset,
    imageData.data.byteLength,
  );
  return encoder.encodeImage(rgba, imageData.width, imageData.height);
}

async function encodeGif(imageData: ImageData): Promise<Uint8Array> {
  const { GIFEncoder, quantize, applyPalette } = await import("gifenc");
  const rgba = new Uint8Array(
    imageData.data.buffer,
    imageData.data.byteOffset,
    imageData.data.byteLength,
  );
  const palette = quantize(rgba, 256);
  const indexed = applyPalette(rgba, palette);
  const encoder = GIFEncoder();
  encoder.writeFrame(indexed, imageData.width, imageData.height, { palette });
  encoder.finish();
  return encoder.bytes();
}

async function encodeIco(imageData: ImageData): Promise<ArrayBuffer> {
  const png = await encodeWithWasm(imageData, "image/png", 1);
  const output = new ArrayBuffer(22 + png.byteLength);
  const bytes = new Uint8Array(output);
  const view = new DataView(output);
  view.setUint16(2, 1, true);
  view.setUint16(4, 1, true);
  view.setUint8(6, imageData.width >= 256 ? 0 : imageData.width);
  view.setUint8(7, imageData.height >= 256 ? 0 : imageData.height);
  view.setUint8(8, 0);
  view.setUint8(9, 0);
  view.setUint16(10, 1, true);
  view.setUint16(12, 32, true);
  view.setUint32(14, png.byteLength, true);
  view.setUint32(18, 22, true);
  bytes.set(new Uint8Array(png), 22);
  return output;
}

async function resizeForIcon(imageData: ImageData): Promise<ImageData> {
  const largestSide = Math.max(imageData.width, imageData.height);
  if (largestSide <= 256) return imageData;
  const ratio = 256 / largestSide;
  const width = Math.max(1, Math.round(imageData.width * ratio));
  const height = Math.max(1, Math.round(imageData.height * ratio));

  if (typeof OffscreenCanvas !== "undefined") {
    const sourceCanvas = new OffscreenCanvas(imageData.width, imageData.height);
    const sourceContext = sourceCanvas.getContext("2d");
    const targetCanvas = new OffscreenCanvas(width, height);
    const targetContext = targetCanvas.getContext("2d");
    if (!sourceContext || !targetContext) throw new Error("ICO resize failed");
    sourceContext.putImageData(imageData, 0, 0);
    targetContext.drawImage(sourceCanvas, 0, 0, width, height);
    const resized = targetContext.getImageData(0, 0, width, height);
    sourceCanvas.width = 0;
    targetCanvas.width = 0;
    return resized;
  }

  if (typeof document === "undefined") throw new Error("ICO resize failed");
  const sourceCanvas = document.createElement("canvas");
  sourceCanvas.width = imageData.width;
  sourceCanvas.height = imageData.height;
  const sourceContext = sourceCanvas.getContext("2d");
  const targetCanvas = document.createElement("canvas");
  targetCanvas.width = width;
  targetCanvas.height = height;
  const targetContext = targetCanvas.getContext("2d");
  if (!sourceContext || !targetContext) throw new Error("ICO resize failed");
  sourceContext.putImageData(imageData, 0, 0);
  targetContext.drawImage(sourceCanvas, 0, 0, width, height);
  const resized = targetContext.getImageData(0, 0, width, height);
  sourceCanvas.width = 0;
  targetCanvas.width = 0;
  return resized;
}

async function encodeSvgWrapper(imageData: ImageData): Promise<string> {
  const png = new Uint8Array(await encodeWithWasm(imageData, "image/png", 1));
  const base64 = toBase64(png);
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${imageData.width}" height="${imageData.height}" viewBox="0 0 ${imageData.width} ${imageData.height}">`,
    `<image width="${imageData.width}" height="${imageData.height}" href="data:image/png;base64,${base64}"/>`,
    "</svg>",
  ].join("");
}

function toBase64(bytes: Uint8Array): string {
  const chunkSize = 0x8000;
  let binary = "";
  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    const chunk = bytes.subarray(offset, offset + chunkSize);
    binary += String.fromCharCode(...chunk);
  }
  return btoa(binary);
}

function copyToArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  const buffer = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(buffer).set(bytes);
  return buffer;
}
