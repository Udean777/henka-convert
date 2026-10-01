export type AudioFormat = "audio/mpeg" | "audio/wav";

export type AudioConversionErrorCode =
  | "worker-unsupported"
  | "input-unsupported"
  | "output-unsupported"
  | "audio-too-large"
  | "audio-too-long"
  | "audio-duration-unavailable"
  | "audio-wav-too-large"
  | "audio-conversion-failed";
