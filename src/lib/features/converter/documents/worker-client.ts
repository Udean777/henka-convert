import { DocumentConversionError } from "./errors";
import type { DocumentConversionErrorCode, DocumentFormat } from "./types";

type WorkerResponse =
  | { type: "progress"; progress: number }
  | { type: "result"; blob: Blob; note?: string }
  | { type: "error"; code: DocumentConversionErrorCode };

export function convertDocumentInWorker(
  file: File,
  target: DocumentFormat,
  language: "en" | "id",
  onProgress: (progress: number) => void,
): Promise<{ blob: Blob; note?: string }> {
  let worker: Worker;
  try {
    worker = new Worker(new URL("./worker.ts", import.meta.url), {
      type: "module",
      name: "henka-document-conversion",
    });
  } catch {
    throw new DocumentConversionError("worker-unsupported");
  }

  return new Promise((resolve, reject) => {
    const finish = () => worker.terminate();
    worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
      const response = event.data;
      if (response.type === "progress") {
        onProgress(response.progress);
      } else if (response.type === "result") {
        finish();
        resolve(response);
      } else {
        finish();
        reject(new DocumentConversionError(response.code));
      }
    };
    worker.onerror = () => {
      finish();
      reject(new DocumentConversionError("document-conversion-failed"));
    };
    try {
      worker.postMessage({ file, target, language });
    } catch {
      finish();
      reject(new DocumentConversionError("document-conversion-failed"));
    }
  });
}
