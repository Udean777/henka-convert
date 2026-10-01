import type { ImageConversionErrorCode, ImageFormat } from "./types";
import { MAX_IMAGE_DIMENSION, MAX_IMAGE_PIXELS } from "../shared/limits";
import { decodeWithWasm } from "./codecs";
import { encodeImageData } from "./encoders";
import { decodeTiff, isTiffFile } from "./tiff";

interface ConvertRequest {
  file: File;
  source: Blob;
  bitmap?: ImageBitmap;
  target: ImageFormat;
  quality: number;
  background: string;
}

const workerScope = self as unknown as {
  addEventListener: (
    type: "message",
    listener: (event: MessageEvent<ConvertRequest>) => void,
  ) => void;
  postMessage: (message: unknown) => void;
};

workerScope.addEventListener("message", async ({ data }) => {
  let bitmap: ImageBitmap | undefined = data.bitmap;
  try {
    if (typeof OffscreenCanvas === "undefined") {
      throw conversionError("worker-unsupported");
    }

    let imageData: ImageData | undefined;
    if (!bitmap && isTiffFile(data.file)) {
      imageData = await decodeTiff(data.source);
    } else if (
      !bitmap &&
      (/\.(heic|heif)$/i.test(data.file.name) ||
        /image\/(heic|heif)/i.test(data.file.type))
    ) {
      try {
        const { heicTo } = await import("heic-to/next");
        bitmap = await heicTo({ blob: data.file, type: "bitmap" });
      } catch {
        throw conversionError("input-unsupported");
      }
    } else if (!bitmap) {
      try {
        bitmap = await createImageBitmap(data.source);
      } catch {
        try {
          imageData = await decodeWithWasm(data.source, data.file);
        } catch {
          throw conversionError("input-unsupported");
        }
      }
    }

    const width = bitmap?.width ?? imageData?.width;
    const height = bitmap?.height ?? imageData?.height;
    if (
      !width ||
      !height ||
      width * height > MAX_IMAGE_PIXELS ||
      width > MAX_IMAGE_DIMENSION ||
      height > MAX_IMAGE_DIMENSION
    ) {
      throw conversionError("image-too-large");
    }

    if (bitmap) {
      const canvas = new OffscreenCanvas(width, height);
      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (!context) throw conversionError("conversion-failed");
      if (data.target === "image/jpeg") {
        context.fillStyle = data.background;
        context.fillRect(0, 0, canvas.width, canvas.height);
      }
      context.drawImage(bitmap, 0, 0);
      bitmap.close();
      bitmap = undefined;
      imageData = context.getImageData(0, 0, width, height);
    }

    if (!imageData) throw conversionError("input-unsupported");
    if (
      data.target === "image/jpeg" ||
      data.target === "image/bmp" ||
      data.target === "image/gif"
    ) {
      flattenAlpha(imageData);
    }
    const blob = await encodeImageData(imageData, data.target, data.quality);
    workerScope.postMessage({ type: "convert", ok: true, blob });
  } catch (error) {
    bitmap?.close();
    const code = isImageConversionErrorCode(error)
      ? error.code
      : "conversion-failed";
    workerScope.postMessage({ type: "convert", ok: false, code });
  }
});

function flattenAlpha(imageData: ImageData): void {
  const pixels = imageData.data;
  for (let index = 0; index < pixels.length; index += 4) {
    const alpha = pixels[index + 3] / 255;
    if (alpha < 1) {
      pixels[index] = Math.round(pixels[index] * alpha + 255 * (1 - alpha));
      pixels[index + 1] = Math.round(
        pixels[index + 1] * alpha + 255 * (1 - alpha),
      );
      pixels[index + 2] = Math.round(
        pixels[index + 2] * alpha + 255 * (1 - alpha),
      );
      pixels[index + 3] = 255;
    }
  }
}

function conversionError(code: ImageConversionErrorCode): Error & {
  code: ImageConversionErrorCode;
} {
  return Object.assign(new Error(code), { code });
}

function isImageConversionErrorCode(
  error: unknown,
): error is Error & { code: ImageConversionErrorCode } {
  return (
    error instanceof Error && "code" in error && typeof error.code === "string"
  );
}
