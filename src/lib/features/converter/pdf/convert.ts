import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { removeExtension } from "../shared/files";
import type { ConversionOutput } from "../shared/types";
import type { PdfImageFormat } from "./types";
import { getImageExtension } from "../image/formats";
import { encodeImageInWorker } from "../image/worker-client";
import { PdfConversionError } from "./errors";

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
  if (!text) throw new PdfConversionError("no-selectable-text");
  return {
    name: `${removeExtension(file.name)}.txt`,
    blob: new Blob([text], { type: "text/plain;charset=utf-8" }),
  };
}

export async function convertImageToPdf(
  file: File,
  quality: number,
  svgOutputWidth: number,
): Promise<ConversionOutput> {
  const { convertImage } = await import("../image/convert");
  const png = await convertImage(file, "image/png", quality, svgOutputWidth);
  const { PDFDocument } = await import("pdf-lib");
  const pdf = await PDFDocument.create();
  const embeddedImage = await pdf.embedPng(await png.blob.arrayBuffer());
  const page = pdf.addPage([
    embeddedImage.width * 0.75,
    embeddedImage.height * 0.75,
  ]);
  page.drawImage(embeddedImage, {
    x: 0,
    y: 0,
    width: page.getWidth(),
    height: page.getHeight(),
  });
  return {
    name: `${removeExtension(file.name)}.pdf`,
    blob: new Blob([copyToArrayBuffer(await pdf.save())], {
      type: "application/pdf",
    }),
  };
}

export async function convertPdfToImages(
  file: File,
  format: PdfImageFormat,
  onProgress: (current: number, total: number) => void,
): Promise<ConversionOutput[]> {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
  const loadingTask = pdfjs.getDocument({
    data: new Uint8Array(await file.arrayBuffer()),
  });
  const document = await loadingTask.promise;
  const outputs: ConversionOutput[] = [];
  const extension = getImageExtension(format);

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
      if (!context) throw new PdfConversionError("page-image-unavailable");
      if (format === "image/jpeg") {
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, canvas.width, canvas.height);
      }

      await page.render({ canvas, canvasContext: context, viewport }).promise;
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const blob = await encodeImageInWorker(imageData, format, 0.92);
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

function copyToArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  const buffer = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(buffer).set(bytes);
  return buffer;
}
