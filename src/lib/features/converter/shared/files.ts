import type { ConverterKind } from "./types";

export const FILE_ACCEPT: Record<ConverterKind, string> = {
  image:
    ".jpg,.jpeg,.png,.webp,.avif,.svg,.bmp,.heic,.heif,image/jpeg,image/png,image/webp,image/avif,image/svg+xml,image/bmp,image/heic,image/heif",
  pdf: ".pdf,application/pdf",
  docx: ".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

const extensions: Record<ConverterKind, string[]> = {
  image: [
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
    ".avif",
    ".svg",
    ".bmp",
    ".heic",
    ".heif",
  ],
  pdf: [".pdf"],
  docx: [".docx"],
};

export function isSupportedFile(file: File, kind: ConverterKind): boolean {
  const name = file.name.toLowerCase();
  return extensions[kind].some((extension) => name.endsWith(extension));
}

export function removeExtension(filename: string): string {
  return filename.replace(/\.[^.]+$/, "") || filename;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB"];
  let value = bytes / 1024;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${value.toFixed(value >= 10 ? 0 : 1)} ${units[unit]}`;
}
