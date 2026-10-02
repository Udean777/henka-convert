import { removeExtension } from "../shared/files";
import { getDocumentExtension } from "./formats";
import type { ConversionOutput } from "../shared/types";
import type { DocumentFormat } from "./types";
import { convertDocumentInWorker } from "./worker-client";

export async function convertDocument(
  file: File,
  format: DocumentFormat,
  language: "en" | "id",
  onProgress: (progress: number) => void,
): Promise<ConversionOutput> {
  const result = await convertDocumentInWorker(
    file,
    format,
    language,
    onProgress,
  );
  return {
    name: `${removeExtension(file.name)}${getDocumentExtension(format)}`,
    blob: result.blob,
    ...(result.note ? { note: result.note } : {}),
  };
}
