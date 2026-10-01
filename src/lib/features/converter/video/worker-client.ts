import { removeExtension } from "../shared/files";
import { VideoConversionError } from "./errors";
import type { VideoConversionErrorCode, VideoFormat } from "./types";

type WorkerResponse =
  | { type: "capabilities"; formats: VideoFormat[] }
  | { type: "progress"; progress: number }
  | { type: "result"; buffer: ArrayBuffer }
  | { type: "error"; code: VideoConversionErrorCode };

export async function getVideoOutputFormats(): Promise<VideoFormat[]> {
  const worker = createVideoWorker();
  return new Promise((resolve, reject) => {
    const timeout = window.setTimeout(() => {
      worker.terminate();
      reject(new VideoConversionError("worker-unsupported"));
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
      reject(new VideoConversionError("worker-unsupported"));
    };
    worker.postMessage({ type: "capabilities" });
  });
}

export function convertVideoInWorker(
  file: File,
  target: VideoFormat,
  onProgress: (progress: number) => void,
): Promise<Blob> {
  const worker = createVideoWorker();
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
        const mimeType = target;
        resolve(new Blob([response.buffer], { type: mimeType }));
      } else if (response.type === "error") {
        finish();
        reject(new VideoConversionError(response.code));
      }
    };
    worker.onerror = () => {
      finish();
      reject(new VideoConversionError("video-conversion-failed"));
    };
    try {
      worker.postMessage({ type: "convert", file, target });
    } catch {
      finish();
      reject(new VideoConversionError("video-conversion-failed"));
    }
  });
}

export function createVideoOutput(file: File, blob: Blob, target: VideoFormat) {
  const extension = target === "video/mp4" ? ".mp4" : ".webm";
  return {
    name: `${removeExtension(file.name)}${extension}`,
    blob,
  };
}

function createVideoWorker(): Worker {
  try {
    return new Worker(new URL("./video.worker.ts", import.meta.url), {
      type: "module",
    });
  } catch {
    throw new VideoConversionError("worker-unsupported");
  }
}
