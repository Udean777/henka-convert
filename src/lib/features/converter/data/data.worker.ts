import { MAX_DATA_FILE_BYTES, MAX_DATA_OUTPUT_BYTES } from "../shared/limits";
import { DataConversionError } from "./errors";
import { getDataFormatFromFilename, isWorkbookFormat } from "./formats";
import { convertTable } from "./table";
import { getSpreadsheetWorksheetNames } from "./spreadsheet";
import type { DataConversionErrorCode, DataFormat } from "./types";

type WorkerRequest =
  | { type: "inspect"; file: File }
  | {
      type: "convert";
      file: File;
      sourceFormat: DataFormat;
      targetFormat: DataFormat;
      worksheetName?: string;
    };

const selfScope = self as unknown as {
  onmessage: ((event: MessageEvent<WorkerRequest>) => void) | null;
  postMessage: (message: unknown, transfer?: Transferable[]) => void;
};

selfScope.onmessage = (event: MessageEvent<WorkerRequest>) => {
  void processRequest(event.data);
};

async function processRequest(request: WorkerRequest) {
  try {
    if (request.file.size > MAX_DATA_FILE_BYTES) {
      throw new DataConversionError("data-too-large");
    }

    if (request.type === "inspect") {
      await inspectWorkbook(request.file);
      return;
    }

    selfScope.postMessage({ type: "progress", progress: 10 });
    const sourceData = isWorkbookFormat(request.sourceFormat)
      ? await request.file.arrayBuffer()
      : await request.file.text();
    selfScope.postMessage({ type: "progress", progress: 40 });
    const result = await convertTable(
      request.sourceFormat,
      request.targetFormat,
      sourceData,
      request.worksheetName,
    );
    const outputSize =
      typeof result === "string" ? new Blob([result]).size : result.byteLength;
    if (outputSize > MAX_DATA_OUTPUT_BYTES) {
      throw new DataConversionError("data-output-too-large");
    }

    selfScope.postMessage({ type: "progress", progress: 95 });
    if (typeof result === "string") {
      selfScope.postMessage({ type: "result", text: result });
    } else {
      const buffer = copyToArrayBuffer(result);
      selfScope.postMessage({ type: "result", buffer }, [buffer]);
    }
  } catch (error) {
    selfScope.postMessage({ type: "error", code: getErrorCode(error) });
  }
}

async function inspectWorkbook(file: File) {
  const sourceFormat = getDataFormatFromFilename(file.name);
  if (!sourceFormat || !isWorkbookFormat(sourceFormat)) {
    throw new DataConversionError("data-invalid-input");
  }
  const names = await getSpreadsheetWorksheetNames(await file.arrayBuffer());
  if (names.length === 0) {
    throw new DataConversionError("data-invalid-input");
  }
  selfScope.postMessage({ type: "sheets", names });
}

function getErrorCode(error: unknown): DataConversionErrorCode {
  return error instanceof DataConversionError
    ? error.code
    : "data-conversion-failed";
}

function copyToArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  const buffer = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(buffer).set(bytes);
  return buffer;
}
