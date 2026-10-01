import type { ImageConversionErrorCode, ImageFormat } from "./types";
import { ImageConversionError } from "./errors";

type WorkerResponse =
  | { type: "capabilities"; formats: ImageFormat[] }
  | { type: "convert"; ok: true; blob: Blob }
  | { type: "convert"; ok: false; code: ImageConversionErrorCode };

export async function getImageOutputFormats(): Promise<ImageFormat[]> {
  const worker = createCapabilitiesWorker();
  return new Promise((resolve, reject) => {
    const timeout = window.setTimeout(() => {
      worker.terminate();
      reject(new ImageConversionError("worker-unsupported"));
    }, 10_000);

    worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
      if (event.data.type !== "capabilities") return;
      window.clearTimeout(timeout);
      worker.terminate();
      resolve(event.data.formats);
    };
    worker.onerror = () => {
      window.clearTimeout(timeout);
      worker.terminate();
      reject(new ImageConversionError("worker-unsupported"));
    };
    worker.postMessage({ type: "capabilities" });
  });
}

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

function createImageWorker(): Worker {
  try {
    return new Worker(new URL("./image.worker.ts", import.meta.url), {
      type: "module",
    });
  } catch {
    throw new ImageConversionError("worker-unsupported");
  }
}

function createCapabilitiesWorker(): Worker {
  try {
    return new Worker(new URL("./capabilities.worker.ts", import.meta.url), {
      type: "module",
    });
  } catch {
    throw new ImageConversionError("worker-unsupported");
  }
}
