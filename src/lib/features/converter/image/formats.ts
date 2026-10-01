import type { ImageFormatOption, ImageTargetFormat } from "./types";

export const IMAGE_OUTPUT_FORMATS: ImageFormatOption[] = [
  { value: "image/jpeg", label: "JPEG" },
  { value: "image/png", label: "PNG" },
  { value: "image/webp", label: "WebP" },
  { value: "image/avif", label: "AVIF" },
  { value: "image/bmp", label: "BMP" },
  { value: "image/tiff", label: "TIFF" },
  { value: "image/gif", label: "GIF (first frame only)" },
  { value: "image/x-icon", label: "ICO" },
  { value: "image/jxl", label: "JPEG XL" },
  { value: "image/heic", label: "HEIC" },
  { value: "image/svg+xml", label: "SVG (image inside)" },
  { value: "application/pdf", label: "PDF" },
];

export const RASTER_IMAGE_EXTENSIONS: Record<ImageTargetFormat, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/bmp": "bmp",
  "image/tiff": "tiff",
  "image/gif": "gif",
  "image/x-icon": "ico",
  "image/jxl": "jxl",
  "image/heic": "heic",
  "image/svg+xml": "svg",
  "application/pdf": "pdf",
};

export const IMAGE_FORMAT_LABELS: Record<ImageTargetFormat, string> = {
  "image/jpeg": "JPEG",
  "image/png": "PNG",
  "image/webp": "WebP",
  "image/avif": "AVIF",
  "image/bmp": "BMP",
  "image/tiff": "TIFF",
  "image/gif": "GIF",
  "image/x-icon": "ICO",
  "image/jxl": "JPEG XL",
  "image/heic": "HEIC",
  "image/svg+xml": "SVG",
  "application/pdf": "PDF",
};

export function getImageExtension(format: ImageTargetFormat): string {
  return RASTER_IMAGE_EXTENSIONS[format];
}
