export type ConverterKind = "image" | "pdf" | "docx";
export type ImageFormat = "image/jpeg" | "image/png" | "image/webp";
export type PdfFormat = ImageFormat | "text/plain";
export type DocumentFormat = "text/html" | "text/plain" | "text/markdown";
export type OutputFormat = ImageFormat | PdfFormat | DocumentFormat;

export interface ConversionOutput {
  name: string;
  blob: Blob;
  note?: string;
}

export interface FileJob {
  id: string;
  kind: ConverterKind;
  file: File;
  status: "ready" | "converting" | "done" | "error";
  progress: number;
  outputs: ConversionOutput[];
  error?: string;
}
