export type AudioFormat =
  | "audio/mpeg"
  | "audio/wav"
  | "audio/mp4"
  | "audio/ogg"
  | "audio/flac"
  | "audio/aiff"
  | "audio/x-ms-wma";

export type AudioConversionErrorCode =
  | "worker-unsupported"
  | "input-unsupported"
  | "output-unsupported"
  | "audio-too-large"
  | "audio-too-long"
  | "audio-duration-unavailable"
  | "audio-output-too-large"
  | "audio-conversion-failed";
