import type { VideoConversionErrorCode } from "./types";

export class VideoConversionError extends Error {
  constructor(readonly code: VideoConversionErrorCode) {
    super(code);
    this.name = "VideoConversionError";
  }
}
