import {
  MAX_IMAGE_DIMENSION,
  MAX_IMAGE_PIXELS,
  MAX_SVG_OUTPUT_WIDTH,
} from "../shared/limits";
import { ImageConversionError } from "./errors";

export function isSvgFile(file: File): boolean {
  return /\.svg$/i.test(file.name) || file.type === "image/svg+xml";
}

export async function prepareSvgForRasterization(
  file: File,
  outputWidth: number,
): Promise<Blob> {
  if (
    !Number.isInteger(outputWidth) ||
    outputWidth < 1 ||
    outputWidth > MAX_SVG_OUTPUT_WIDTH
  ) {
    throw new ImageConversionError("svg-dimensions-missing");
  }

  let document: Document;
  try {
    const source = await file.text();
    document = new DOMParser().parseFromString(source, "image/svg+xml");
  } catch {
    throw new ImageConversionError("invalid-svg");
  }

  const root = document.documentElement;
  if (
    root.localName.toLowerCase() !== "svg" ||
    document.querySelector("parsererror")
  ) {
    throw new ImageConversionError("invalid-svg");
  }

  const ratio = getSvgAspectRatio(root);
  if (!ratio) throw new ImageConversionError("svg-dimensions-missing");

  const outputHeight = Math.max(1, Math.round(outputWidth / ratio));
  if (
    outputHeight > MAX_IMAGE_DIMENSION ||
    outputWidth * outputHeight > MAX_IMAGE_PIXELS
  ) {
    throw new ImageConversionError("image-too-large");
  }

  root.setAttribute("width", String(outputWidth));
  root.setAttribute("height", String(outputHeight));
  const resizedSource = new XMLSerializer().serializeToString(document);
  return new Blob([resizedSource], { type: "image/svg+xml" });
}

export async function decodeSvg(source: Blob): Promise<ImageBitmap> {
  const url = URL.createObjectURL(source);
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    return await createImageBitmap(image);
  } catch {
    throw new ImageConversionError("svg-unsupported");
  } finally {
    URL.revokeObjectURL(url);
  }
}

function getSvgAspectRatio(root: Element): number | undefined {
  const viewBox = root
    .getAttribute("viewBox")
    ?.trim()
    .split(/[\s,]+/)
    .map(Number);
  if (
    viewBox?.length === 4 &&
    Number.isFinite(viewBox[2]) &&
    Number.isFinite(viewBox[3]) &&
    viewBox[2] > 0 &&
    viewBox[3] > 0
  ) {
    return viewBox[2] / viewBox[3];
  }

  const width = parseSvgLength(root.getAttribute("width"));
  const height = parseSvgLength(root.getAttribute("height"));
  if (width && height) return width / height;
  return undefined;
}

function parseSvgLength(value: string | null): number | undefined {
  if (!value) return undefined;
  const match = value.trim().match(/^([\d.]+)\s*(px|pt|pc|mm|cm|in)?$/i);
  if (!match) return undefined;
  const number = Number(match[1]);
  if (!Number.isFinite(number) || number <= 0) return undefined;

  const unitScale: Record<string, number> = {
    px: 1,
    pt: 96 / 72,
    pc: 16,
    mm: 96 / 25.4,
    cm: 96 / 2.54,
    in: 96,
  };
  return number * unitScale[(match[2] ?? "px").toLowerCase()];
}
