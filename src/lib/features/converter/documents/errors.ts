import type { DocumentConversionErrorCode } from "./types";

export class DocumentConversionError extends Error {
  constructor(readonly code: DocumentConversionErrorCode) {
    super(code);
    this.name = "DocumentConversionError";
  }
}
