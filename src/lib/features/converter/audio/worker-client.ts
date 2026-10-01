import { removeExtension } from "../shared/files";
import { AudioConversionError } from "./errors";
import type { AudioConversionErrorCode, AudioFormat } from "./types";

type WorkerResponse =
  | { type: "capabilities"; formats: AudioFormat[] }
  | { type: "progress"; progress: number }
  | { type: "result"; buffer: ArrayBuffer }
  | { type: "error"; code: AudioConversionErrorCode };

export async function getAudioOutputFormats(): Promise<AudioFormat[]> {
  const worker = createAudioWorker();

  return new Promise((resolve, reject) => {
    const timeout = window.setTimeout(() => {
      worker.terminate();
      reject(new AudioConversionError("worker-unsupported"));
    }, 15_000);

    worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
      if (event.data.type !== "capabilities") return;
      window.clearTimeout(timeout);
      worker.terminate();
      resolve(event.data.formats);
    };
    worker.onerror = () => {
      window.clearTimeout(timeout);
      worker.terminate();
      reject(new AudioConversionError("worker-unsupported"));
    };
    worker.postMessage({ type: "capabilities" });
  });
}

export function convertAudioInWorker(
  file: File,
  target: AudioFormat,
  onProgress: (progress: number) => void,
): Promise<Blob> {
  const worker = createAudioWorker();

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
        resolve(new Blob([response.buffer], { type: target }));
      } else if (response.type === "error") {
        finish();
        reject(new AudioConversionError(response.code));
      }
    };
    worker.onerror = () => {
      finish();
      reject(new AudioConversionError("audio-conversion-failed"));
    };
    try {
      worker.postMessage({ type: "convert", file, target });
    } catch {
      finish();
      reject(new AudioConversionError("audio-conversion-failed"));
    }
  });
}

export function createAudioOutput(file: File, blob: Blob, target: AudioFormat) {
  const extension = target === "audio/mpeg" ? ".mp3" : ".wav";
  return {
    name: `${removeExtension(file.name)}${extension}`,
    blob,
  };
}

function createAudioWorker(): Worker {
  try {
    return new Worker(new URL("./audio.worker.ts", import.meta.url), {
      type: "module",
    });
  } catch {
    throw new AudioConversionError("worker-unsupported");
  }
}
