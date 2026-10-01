import { removeExtension } from "../shared/files";
import type { ConversionOutput } from "../shared/types";
import type { ImageFormat } from "./types";
import { getImageExtension } from "./formats";
import { convertInWorker } from "./worker-client";
import { decodeSvg, isSvgFile, prepareSvgForRasterization } from "./svg";

export async function convertImage(
  file: File,
  target: ImageFormat,
  quality: number,
  svgOutputWidth: number,
): Promise<ConversionOutput> {
  if (target === "image/svg+xml" && isSvgFile(file)) {
    return {
      name: `${removeExtension(file.name)}.svg`,
      blob: file,
    };
  }
  const extension = getImageExtension(target);
  const name = `${removeExtension(file.name)}.${extension}`;
  const svg = isSvgFile(file);
  const source = svg
    ? await prepareSvgForRasterization(file, svgOutputWidth)
    : file;
  const bitmap = svg ? await decodeSvg(source) : undefined;
  const blob = await convertInWorker(file, source, target, quality, bitmap);
  return { name, blob };
}
