import { createDataOutput, convertDataInWorker } from "./worker-client";
import type { DataFormat } from "./types";

export async function convertData(
  file: File,
  targetFormat: DataFormat,
  onProgress: (progress: number) => void,
  worksheetName?: string,
) {
  const blob = await convertDataInWorker(
    file,
    targetFormat,
    onProgress,
    worksheetName,
  );
  return createDataOutput(file, blob, targetFormat);
}
