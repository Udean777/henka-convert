import { removeExtension } from "../shared/files";
import { DataConversionError } from "./errors";
import {
  getDataFormatFromFilename,
  getDataExtension,
  isWorkbookFormat,
} from "./formats";
import type { DataConversionErrorCode, DataFormat } from "./types";

type WorkerResponse =
  | { type: "progress"; progress: number }
  | { type: "result"; text: string }
  | { type: "result"; buffer: ArrayBuffer }
  | { type: "sheets"; names: string[] }
  | { type: "error"; code: DataConversionErrorCode };

export function convertDataInWorker(
  file: File,
  targetFormat: DataFormat,
  onProgress: (progress: number) => void,
  worksheetName?: string,
): Promise<Blob> {
  const sourceFormat = getDataFormatFromFilename(file.name);
  if (!sourceFormat) {
    return Promise.reject(new DataConversionError("data-invalid-input"));
  }

  const worker = createDataWorker();
  return new Promise((resolve, reject) => {
    const finish = () => worker.terminate();

    worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
      const response = event.data;
      if (response.type === "progress") {
        onProgress(response.progress);
        return;
      }
      if (response.type === "result") {
        finish();
        resolve(
          "text" in response
            ? new Blob([response.text], { type: targetFormat })
            : new Blob([response.buffer], { type: targetFormat }),
        );
      } else if (response.type === "error") {
        finish();
        reject(new DataConversionError(response.code));
      }
    };
    worker.onerror = () => {
      finish();
      reject(new DataConversionError("data-conversion-failed"));
    };

    try {
      worker.postMessage({
        type: "convert",
        file,
        sourceFormat,
        targetFormat,
        worksheetName,
      });
    } catch {
      finish();
      reject(new DataConversionError("data-conversion-failed"));
    }
  });
}

export function inspectSpreadsheetInWorker(file: File): Promise<string[]> {
  const sourceFormat = getDataFormatFromFilename(file.name);
  if (!sourceFormat || !isWorkbookFormat(sourceFormat)) {
    return Promise.reject(new DataConversionError("data-invalid-input"));
  }

  const worker = createDataWorker();
  return new Promise((resolve, reject) => {
    const finish = () => worker.terminate();
    worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
      const response = event.data;
      if (response.type === "sheets") {
        finish();
        resolve(response.names);
      } else if (response.type === "error") {
        finish();
        reject(new DataConversionError(response.code));
      }
    };
    worker.onerror = () => {
      finish();
      reject(new DataConversionError("data-conversion-failed"));
    };

    try {
      worker.postMessage({ type: "inspect", file });
    } catch {
      finish();
      reject(new DataConversionError("data-conversion-failed"));
    }
  });
}

export function createDataOutput(file: File, blob: Blob, format: DataFormat) {
  const extension = getDataExtension(format);
  return {
    name: `${removeExtension(file.name)}${extension}`,
    blob,
  };
}

function createDataWorker(): Worker {
  try {
    return new Worker(new URL("./data.worker.ts", import.meta.url), {
      type: "module",
    });
  } catch {
    throw new DataConversionError("worker-unsupported");
  }
}
