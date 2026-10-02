export type VideoFormat =
  | "video/mp4"
  | "video/quicktime"
  | "video/webm"
  | "video/x-matroska"
  | "video/x-msvideo"
  | "video/x-m4v"
  | "video/3gpp"
  | "video/mpeg"
  | "video/mp2t";

export type VideoConversionErrorCode =
  | "worker-unsupported"
  | "input-unsupported"
  | "output-unsupported"
  | "video-too-large"
  | "video-too-long"
  | "video-duration-unavailable"
  | "video-output-too-large"
  | "video-resolution-too-large"
  | "video-conversion-failed";
