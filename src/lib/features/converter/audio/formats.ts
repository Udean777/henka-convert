import type { AudioFormat } from "./types";

export interface AudioFormatOption {
  value: AudioFormat;
  label: string;
}

export const AUDIO_FORMAT_OPTIONS: AudioFormatOption[] = [
  { value: "audio/mpeg", label: "MP3" },
  { value: "audio/wav", label: "WAV" },
  { value: "audio/mp4", label: "M4A" },
  { value: "audio/ogg", label: "OGG" },
  { value: "audio/flac", label: "FLAC" },
  { value: "audio/aiff", label: "AIFF" },
  { value: "audio/x-ms-wma", label: "WMA" },
];

export const AUDIO_FORMATS = AUDIO_FORMAT_OPTIONS.map(({ value }) => value);

export function getAudioFormatFromFilename(
  filename: string,
): AudioFormat | null {
  const name = filename.toLowerCase();
  if (name.endsWith(".mp3")) return "audio/mpeg";
  if (name.endsWith(".wav")) return "audio/wav";
  if (name.endsWith(".m4a") || name.endsWith(".aac")) return "audio/mp4";
  if (name.endsWith(".ogg") || name.endsWith(".opus")) return "audio/ogg";
  if (name.endsWith(".flac")) return "audio/flac";
  if (name.endsWith(".aif") || name.endsWith(".aiff")) return "audio/aiff";
  if (name.endsWith(".wma")) return "audio/x-ms-wma";
  return null;
}

export function getAudioExtension(format: AudioFormat): string {
  switch (format) {
    case "audio/mpeg":
      return ".mp3";
    case "audio/wav":
      return ".wav";
    case "audio/mp4":
      return ".m4a";
    case "audio/ogg":
      return ".ogg";
    case "audio/flac":
      return ".flac";
    case "audio/aiff":
      return ".aiff";
    case "audio/x-ms-wma":
      return ".wma";
  }
}
