export type VideoFormat = "video/mp4" | "video/webm";

export type VideoConversionErrorCode =
  | "worker-unsupported"
  | "input-unsupported"
  | "output-unsupported"
  | "video-too-large"
  | "video-too-long"
  | "video-duration-unavailable"
  | "video-resolution-too-large"
  | "video-conversion-failed";
