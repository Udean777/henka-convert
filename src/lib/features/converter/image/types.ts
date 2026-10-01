export type ImageFormat =
  | "image/jpeg"
  | "image/png"
  | "image/webp"
  | "image/avif"
  | "image/bmp"
  | "image/tiff"
  | "image/gif"
  | "image/x-icon"
  | "image/jxl"
  | "image/heic"
  | "image/svg+xml";

export type RasterImageFormat = Exclude<ImageFormat, "image/svg+xml">;
export type WasmImageFormat =
  "image/jpeg" | "image/png" | "image/webp" | "image/avif" | "image/jxl";
export type ImageTargetFormat = ImageFormat | "application/pdf";

export interface ImageFormatOption {
  value: ImageTargetFormat;
  label: string;
}

export type ImageConversionErrorCode =
  | "worker-unsupported"
  | "input-unsupported"
  | "output-unsupported"
  | "invalid-svg"
  | "svg-unsupported"
  | "svg-dimensions-missing"
  | "image-too-large"
  | "conversion-failed";
