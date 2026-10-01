import { MAX_IMAGE_DIMENSION, MAX_IMAGE_PIXELS } from "../shared/limits";
import { ImageConversionError } from "./errors";

interface TiffDecoder {
  decode(buffer: ArrayBuffer): TiffPage[];
  decodeImage(buffer: ArrayBuffer, page: TiffPage): void;
  toRGBA8(page: TiffPage): Uint8Array;
}

interface TiffPage {
  width?: number;
  height?: number;
  t256?: number[];
  t257?: number[];
}

export function isTiffFile(file: File): boolean {
  return /\.tiff?$/i.test(file.name) || /image\/(tiff|x-tiff)/i.test(file.type);
}

export async function decodeTiff(source: Blob): Promise<ImageData> {
  const buffer = await source.arrayBuffer();
  try {
    const loadedModule = (await import("utif2")) as typeof import("utif2") & {
      default?: typeof import("utif2");
    };
    const decoder = (loadedModule.default ?? loadedModule) as TiffDecoder;
    const firstPage = decoder.decode(buffer)[0];

    if (!firstPage) throw new ImageConversionError("input-unsupported");
    const dimensions = getDimensions(firstPage);
    if (!dimensions) throw new ImageConversionError("input-unsupported");
    const { width, height } = dimensions;
    validateDimensions(width, height);
    decoder.decodeImage(buffer, firstPage);

    const rgba = decoder.toRGBA8(firstPage);
    if (rgba.byteLength !== width * height * 4) {
      throw new ImageConversionError("input-unsupported");
    }
    const clampedPixels = new Uint8ClampedArray(
      rgba.buffer as ArrayBuffer,
      rgba.byteOffset,
      rgba.byteLength,
    );
    return new ImageData(clampedPixels, width, height);
  } catch (error) {
    if (error instanceof ImageConversionError) throw error;
    throw new ImageConversionError("input-unsupported");
  }
}

function getDimensions(page: TiffPage):
  | { width: number; height: number }
  | undefined {
  const width = page.width ?? page.t256?.[0];
  const height = page.height ?? page.t257?.[0];
  if (width === undefined || height === undefined) return undefined;
  return { width, height };
}

function validateDimensions(width: number, height: number): void {
  if (
    !Number.isInteger(width) ||
    !Number.isInteger(height) ||
    width < 1 ||
    height < 1
  ) {
    throw new ImageConversionError("input-unsupported");
  }
  if (
    width > MAX_IMAGE_DIMENSION ||
    height > MAX_IMAGE_DIMENSION ||
    width * height > MAX_IMAGE_PIXELS
  ) {
    throw new ImageConversionError("image-too-large");
  }
}
