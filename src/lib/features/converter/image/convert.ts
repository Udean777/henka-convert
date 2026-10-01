import { removeExtension } from "../shared/files";
import type { ConversionOutput, ImageFormat } from "../shared/types";

export async function convertImage(
  file: File,
  target: ImageFormat,
  quality: number,
): Promise<ConversionOutput> {
  const extension =
    target === "image/jpeg" ? "jpg" : target.slice("image/".length);
  const name = `${removeExtension(file.name)}.${extension}`;
  const blob = await convertInWorker(file, target, quality);
  return { name, blob };
}

function convertInWorker(
  file: File,
  target: ImageFormat,
  quality: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL("./image.worker.ts", import.meta.url), {
      type: "module",
    });
    worker.onmessage = (
      event: MessageEvent<{ ok: boolean; blob?: Blob; error?: string }>,
    ) => {
      worker.terminate();
      if (event.data.ok && event.data.blob) resolve(event.data.blob);
      else reject(new Error(event.data.error ?? "Image conversion failed."));
    };
    worker.onerror = () => {
      worker.terminate();
      reject(
        new Error("Image conversion failed. Check the file and try again."),
      );
    };
    worker.postMessage({ file, target, quality, background: "#ffffff" });
  });
}
