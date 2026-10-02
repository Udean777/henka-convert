export type DocumentFormat =
  | "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  | "text/html"
  | "text/plain"
  | "text/markdown";

export type DocumentConversionErrorCode =
  | "worker-unsupported"
  | "document-too-large"
  | "document-output-too-large"
  | "document-input-unsupported"
  | "document-conversion-failed";
