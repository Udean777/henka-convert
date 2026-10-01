import type { ConverterKind } from "./types";

export const FILE_ACCEPT: Record<ConverterKind, string> = {
  image:
    ".jpg,.jpeg,.png,.webp,.avif,.svg,.bmp,.tif,.tiff,.heic,.heif,.gif,.ico,.jxl,image/jpeg,image/png,image/webp,image/avif,image/svg+xml,image/bmp,image/tiff,image/x-tiff,image/heic,image/heif,image/gif,image/x-icon,image/jxl",
  pdf: ".pdf,application/pdf",
  docx: ".docx,.html,.htm,.txt,.md,.markdown,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/html,text/plain,text/markdown",
  video:
    ".mp4,.mov,.webm,.mkv,.avi,.m4v,.3gp,.3gpp,.mpeg,.mpg,.ts,video/mp4,video/quicktime,video/webm,video/x-matroska,video/x-msvideo,video/x-m4v,video/3gpp,video/mpeg,video/mp2t",
  audio:
    ".mp3,.wav,.m4a,.aac,.ogg,.opus,.flac,.aif,.aiff,.wma,audio/mpeg,audio/wav,audio/x-wav,audio/mp4,audio/aac,audio/ogg,audio/opus,audio/flac,audio/aiff,audio/x-ms-wma",
  data: ".csv,.tsv,.json,.xlsx,.xls,.ods,.html,.htm,text/csv,text/tab-separated-values,application/json,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,application/vnd.oasis.opendocument.spreadsheet,text/html",
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
    ".tif",
    ".tiff",
    ".heic",
    ".heif",
    ".gif",
    ".ico",
    ".jxl",
  ],
  pdf: [".pdf"],
  docx: [".docx", ".html", ".htm", ".txt", ".md", ".markdown"],
  video: [
    ".mp4",
    ".mov",
    ".webm",
    ".mkv",
    ".avi",
    ".m4v",
    ".3gp",
    ".3gpp",
    ".mpeg",
    ".mpg",
    ".ts",
  ],
  audio: [
    ".mp3",
    ".wav",
    ".m4a",
    ".aac",
    ".ogg",
    ".opus",
    ".flac",
    ".aif",
    ".aiff",
    ".wma",
  ],
  data: [".csv", ".tsv", ".json", ".xlsx", ".xls", ".ods", ".html", ".htm"],
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
