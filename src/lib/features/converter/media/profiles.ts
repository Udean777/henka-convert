import { getAudioExtension } from "../audio/formats";
import type { AudioFormat } from "../audio/types";
import { getVideoExtension } from "../video/formats";
import type { VideoFormat } from "../video/types";

export function getAudioOutputArguments(format: AudioFormat): string[] {
  switch (format) {
    case "audio/mpeg":
      return ["-c:a", "libmp3lame", "-b:a", "192k", "-f", "mp3"];
    case "audio/wav":
      return ["-c:a", "pcm_s16le", "-f", "wav"];
    case "audio/mp4":
      return ["-c:a", "aac", "-b:a", "192k", "-f", "ipod"];
    case "audio/ogg":
      return ["-c:a", "libopus", "-b:a", "160k", "-vbr", "on", "-f", "ogg"];
    case "audio/flac":
      return ["-c:a", "flac", "-compression_level", "5", "-f", "flac"];
    case "audio/aiff":
      return ["-c:a", "pcm_s16be", "-f", "aiff"];
    case "audio/x-ms-wma":
      return ["-c:a", "wmav2", "-b:a", "192k", "-f", "asf"];
  }
}

export function getVideoOutputArguments(format: VideoFormat): string[] {
  switch (format) {
    case "video/mp4":
      return [
        "-c:v",
        "libx264",
        "-preset",
        "veryfast",
        "-crf",
        "23",
        ...aacAudioArguments(),
        "-movflags",
        "+faststart",
        "-f",
        "mp4",
      ];
    case "video/quicktime":
      return [
        "-c:v",
        "libx264",
        "-preset",
        "veryfast",
        "-crf",
        "23",
        ...aacAudioArguments(),
        "-f",
        "mov",
      ];
    case "video/webm":
      return [
        "-c:v",
        "libvpx-vp9",
        "-deadline",
        "good",
        "-cpu-used",
        "5",
        "-crf",
        "32",
        "-b:v",
        "0",
        "-c:a",
        "libopus",
        "-b:a",
        "128k",
        "-f",
        "webm",
      ];
    case "video/x-matroska":
      return [
        "-c:v",
        "libx264",
        "-preset",
        "veryfast",
        "-crf",
        "23",
        ...aacAudioArguments(),
        "-f",
        "matroska",
      ];
    case "video/x-msvideo":
      return [
        "-c:v",
        "mpeg4",
        "-q:v",
        "5",
        "-c:a",
        "libmp3lame",
        "-b:a",
        "128k",
        "-f",
        "avi",
      ];
    case "video/x-m4v":
      return [
        "-c:v",
        "libx264",
        "-preset",
        "veryfast",
        "-crf",
        "23",
        ...aacAudioArguments(),
        "-f",
        "mp4",
      ];
    case "video/3gpp":
      return [
        "-c:v",
        "mpeg4",
        "-q:v",
        "6",
        "-c:a",
        "aac",
        "-b:a",
        "96k",
        "-f",
        "3gp",
      ];
    case "video/mpeg":
      return [
        "-c:v",
        "mpeg2video",
        "-q:v",
        "5",
        "-c:a",
        "mp2",
        "-b:a",
        "192k",
        "-f",
        "mpeg",
      ];
    case "video/mp2t":
      return [
        "-c:v",
        "libx264",
        "-preset",
        "veryfast",
        "-crf",
        "23",
        ...aacAudioArguments(),
        "-f",
        "mpegts",
      ];
  }
}

export function getOutputExtension(format: AudioFormat | VideoFormat): string {
  return format.startsWith("audio/")
    ? getAudioExtension(format as AudioFormat)
    : getVideoExtension(format as VideoFormat);
}

function aacAudioArguments(): string[] {
  return ["-c:a", "aac", "-b:a", "128k"];
}
