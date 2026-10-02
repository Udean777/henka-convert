export type ConverterKind =
  "image" | "pdf" | "docx" | "video" | "audio" | "data";

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
  worksheetNames?: string[];
  selectedWorksheet?: string;
  worksheetNamesLoading?: boolean;
}
