import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { removeExtension } from "../shared/files";
import type { ConversionOutput, ImageFormat } from "../shared/types";

export async function convertPdfToText(file: File): Promise<ConversionOutput> {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
  const loadingTask = pdfjs.getDocument({
    data: new Uint8Array(await file.arrayBuffer()),
  });
  const document = await loadingTask.promise;
  const pages: string[] = [];
  try {
    for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
      const page = await document.getPage(pageNumber);
      const content = await page.getTextContent();
      const line = content.items
        .map((item) => ("str" in item ? item.str : ""))
        .filter(Boolean)
        .join(" ");
      pages.push(line);
    }
  } finally {
    await loadingTask.destroy();
  }

  const text = pages.join("\n\n").trim();
  if (!text) throw new Error("No selectable text was found in this PDF.");
  return {
    name: `${removeExtension(file.name)}.txt`,
    blob: new Blob([text], { type: "text/plain;charset=utf-8" }),
  };
}

export async function convertPdfToImages(
  file: File,
  format: ImageFormat,
  onProgress: (current: number, total: number) => void,
): Promise<ConversionOutput[]> {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
  const loadingTask = pdfjs.getDocument({
    data: new Uint8Array(await file.arrayBuffer()),
  });
  const document = await loadingTask.promise;
  const outputs: ConversionOutput[] = [];
  const extension =
    format === "image/jpeg" ? "jpg" : format.slice("image/".length);

  try {
    for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
      const page = await document.getPage(pageNumber);
      const baseViewport = page.getViewport({ scale: 1 });
      const pixelLimit = 16_000_000;
      const scale = Math.min(
        1.5,
        Math.sqrt(pixelLimit / (baseViewport.width * baseViewport.height)),
      );
      const viewport = page.getViewport({ scale });
      const canvas = window.document.createElement("canvas");
      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);
      const context = canvas.getContext("2d");
      if (!context)
        throw new Error("Could not create an image canvas for this PDF page.");
      if (format === "image/jpeg") {
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, canvas.width, canvas.height);
      }

      await page.render({ canvas, canvasContext: context, viewport }).promise;
      const blob = await canvasToBlob(
        canvas,
        format,
        format === "image/png" ? undefined : 0.92,
      );
      outputs.push({
        name: `${removeExtension(file.name)}-page-${String(pageNumber).padStart(3, "0")}.${extension}`,
        blob,
      });
      canvas.width = 0;
      canvas.height = 0;
      page.cleanup();
      onProgress(pageNumber, document.numPages);
    }
  } finally {
    await loadingTask.destroy();
  }

  return outputs;
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: ImageFormat,
  quality?: number,
) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob || blob.type !== type)
          reject(new Error("This browser cannot create that image format."));
        else resolve(blob);
      },
      type,
      quality,
    );
  });
}
