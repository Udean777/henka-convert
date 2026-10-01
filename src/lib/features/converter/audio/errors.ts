import type { AudioConversionErrorCode } from "./types";

export class AudioConversionError extends Error {
  constructor(readonly code: AudioConversionErrorCode) {
    super(code);
    this.name = "AudioConversionError";
  }
}
