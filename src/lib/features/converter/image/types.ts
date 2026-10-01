export type ImageFormat =
  "image/jpeg" | "image/png" | "image/webp" | "image/avif";

export type ImageConversionErrorCode =
  | "worker-unsupported"
  | "input-unsupported"
  | "output-unsupported"
  | "invalid-svg"
  | "svg-unsupported"
  | "svg-dimensions-missing"
  | "image-too-large"
  | "conversion-failed";
