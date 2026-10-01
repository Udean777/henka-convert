import type { VideoFormat } from "./types";

export interface VideoFormatOption {
  value: VideoFormat;
  label: string;
}

export const VIDEO_FORMAT_OPTIONS: VideoFormatOption[] = [
  { value: "video/mp4", label: "MP4" },
  { value: "video/quicktime", label: "MOV / QuickTime" },
  { value: "video/webm", label: "WebM" },
  { value: "video/x-matroska", label: "MKV" },
  { value: "video/x-msvideo", label: "AVI" },
  { value: "video/x-m4v", label: "M4V" },
  { value: "video/3gpp", label: "3GP" },
  { value: "video/mpeg", label: "MPEG / MPG" },
  { value: "video/mp2t", label: "TS" },
];

export const VIDEO_FORMATS = VIDEO_FORMAT_OPTIONS.map(({ value }) => value);

export function getVideoFormatFromFilename(
  filename: string,
): VideoFormat | null {
  const name = filename.toLowerCase();
  if (name.endsWith(".mp4")) return "video/mp4";
  if (name.endsWith(".mov")) return "video/quicktime";
  if (name.endsWith(".webm")) return "video/webm";
  if (name.endsWith(".mkv")) return "video/x-matroska";
  if (name.endsWith(".avi")) return "video/x-msvideo";
  if (name.endsWith(".m4v")) return "video/x-m4v";
  if (name.endsWith(".3gp") || name.endsWith(".3gpp")) return "video/3gpp";
  if (name.endsWith(".mpeg") || name.endsWith(".mpg")) return "video/mpeg";
  if (name.endsWith(".ts")) return "video/mp2t";
  return null;
}

export function getVideoExtension(format: VideoFormat): string {
  switch (format) {
    case "video/mp4":
      return ".mp4";
    case "video/quicktime":
      return ".mov";
    case "video/webm":
      return ".webm";
    case "video/x-matroska":
      return ".mkv";
    case "video/x-msvideo":
      return ".avi";
    case "video/x-m4v":
      return ".m4v";
    case "video/3gpp":
      return ".3gp";
    case "video/mpeg":
      return ".mpg";
    case "video/mp2t":
      return ".ts";
  }
}
