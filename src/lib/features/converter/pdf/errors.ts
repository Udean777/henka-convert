export type PdfConversionErrorCode =
  "no-selectable-text" | "page-image-unavailable";

export class PdfConversionError extends Error {
  constructor(readonly code: PdfConversionErrorCode) {
    super(code);
    this.name = "PdfConversionError";
  }
}
