import type {
  ImageConversionErrorCode,
  ImageFormat,
  RasterImageFormat,
} from "./types";
import { ImageConversionError } from "./errors";

type WorkerResponse =
  | { type: "convert"; ok: true; blob: Blob }
  | { type: "convert"; ok: false; code: ImageConversionErrorCode };

export function convertInWorker(
  file: File,
  source: Blob,
  target: ImageFormat,
  quality: number,
  bitmap?: ImageBitmap,
): Promise<Blob> {
  const worker = createImageWorker();
  return new Promise((resolve, reject) => {
    worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
      if (event.data.type !== "convert") return;
      worker.terminate();
      if (event.data.ok) resolve(event.data.blob);
      else reject(new ImageConversionError(event.data.code));
    };
    worker.onerror = () => {
      worker.terminate();
      reject(new ImageConversionError("conversion-failed"));
    };
    try {
      worker.postMessage(
        {
          type: "convert",
          file,
          source,
          bitmap,
          target,
          quality,
          background: "#ffffff",
        },
        bitmap ? [bitmap] : [],
      );
    } catch {
      bitmap?.close();
      worker.terminate();
      reject(new ImageConversionError("conversion-failed"));
    }
  });
}

export function encodeImageInWorker(
  imageData: ImageData,
  target: RasterImageFormat,
  quality: number,
): Promise<Blob> {
  let worker: Worker;
  try {
    worker = new Worker(new URL("./encoder.worker.ts", import.meta.url), {
      type: "module",
    });
  } catch {
    return Promise.reject(new ImageConversionError("worker-unsupported"));
  }

  return new Promise((resolve, reject) => {
    worker.onmessage = (event: MessageEvent<{ ok: boolean; blob?: Blob }>) => {
      worker.terminate();
      if (event.data.ok && event.data.blob) resolve(event.data.blob);
      else reject(new ImageConversionError("conversion-failed"));
    };
    worker.onerror = () => {
      worker.terminate();
      reject(new ImageConversionError("conversion-failed"));
    };
    try {
      worker.postMessage({ imageData, target, quality });
    } catch {
      worker.terminate();
      reject(new ImageConversionError("conversion-failed"));
    }
  });
}

function createImageWorker(): Worker {
  try {
    return new Worker(new URL("./image.worker.ts", import.meta.url), {
      type: "module",
    });
  } catch {
    throw new ImageConversionError("worker-unsupported");
  }
}
