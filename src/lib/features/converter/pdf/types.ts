import type { RasterImageFormat } from "../image/types";

export type PdfImageFormat = RasterImageFormat;
export type PdfFormat = PdfImageFormat | "text/plain";

export const PDF_IMAGE_FORMATS: PdfImageFormat[] = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/bmp",
  "image/tiff",
  "image/gif",
  "image/x-icon",
  "image/jxl",
  "image/heic",
];
