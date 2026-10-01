import type { ImageConversionErrorCode } from "./types";

export class ImageConversionError extends Error {
  constructor(readonly code: ImageConversionErrorCode) {
    super(code);
    this.name = "ImageConversionError";
  }
}
