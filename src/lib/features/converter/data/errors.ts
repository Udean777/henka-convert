import type { DataConversionErrorCode } from "./types";

export class DataConversionError extends Error {
  constructor(readonly code: DataConversionErrorCode) {
    super(code);
    this.name = "DataConversionError";
  }
}
