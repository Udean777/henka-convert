import type { Language, messages } from "$lib/i18n/messages";
import type { DocumentFormat } from "./documents/types";
import type { ImageConversionErrorCode, ImageFormat } from "./image/types";
import type { PdfFormat } from "./pdf/types";
import type { VideoConversionErrorCode, VideoFormat } from "./video/types";
import type { AudioConversionErrorCode, AudioFormat } from "./audio/types";
import type { ConversionOutput, FileJob } from "./shared/types";

export type ConversionTarget =
  ImageFormat | PdfFormat | DocumentFormat | VideoFormat | AudioFormat;
type WorkspaceText = (typeof messages)[Language];

interface ConversionOptions {
  target: ConversionTarget;
  quality: number;
  svgOutputWidth: number;
  language: Language;
  text: WorkspaceText;
}

export async function runConversion(
  job: FileJob,
  options: ConversionOptions,
  onProgress: (progress: number) => void,
): Promise<ConversionOutput[]> {
  if (job.kind === "image") {
    if (!isImageFormat(options.target)) {
      throw new Error(options.text.imageOutputUnsupported);
    }
    const { convertImage } = await import("./image/convert");
    return [
      await convertImage(
        job.file,
        options.target,
        options.quality,
        options.svgOutputWidth,
      ),
    ];
  }

  if (job.kind === "pdf") {
    if (!isPdfFormat(options.target)) throw new Error(options.text.errorPrefix);
    if (options.target === "text/plain") {
      const { convertPdfToText } = await import("./pdf/convert");
      onProgress(20);
      const output = await convertPdfToText(job.file);
      onProgress(100);
      return [output];
    }
    const { convertPdfToImages } = await import("./pdf/convert");
    return convertPdfToImages(job.file, options.target, (current, total) =>
      onProgress(Math.round((current / total) * 100)),
    );
  }

  if (job.kind === "video") {
    if (!isVideoFormat(options.target)) {
      throw new Error(options.text.videoOutputUnsupported);
    }
    const { convertVideo } = await import("./video/convert");
    return [await convertVideo(job.file, options.target, onProgress)];
  }

  if (job.kind === "audio") {
    if (!isAudioFormat(options.target)) {
      throw new Error(options.text.audioOutputUnsupported);
    }
    const { convertAudio } = await import("./audio/convert");
    return [await convertAudio(job.file, options.target, onProgress)];
  }

  if (!isDocumentFormat(options.target)) {
    throw new Error(options.text.errorPrefix);
  }
  const { convertDocx } = await import("./documents/convert");
  onProgress(30);
  const output = await convertDocx(job.file, options.target, options.language);
  onProgress(100);
  return [output];
}

export function getConversionErrorMessage(
  error: unknown,
  text: WorkspaceText,
): string {
  if (!(error instanceof Error)) return text.errorPrefix;
  if (isVideoConversionErrorCode(error)) {
    const videoErrors: Record<VideoConversionErrorCode, string> = {
      "worker-unsupported": text.videoWorkerUnsupported,
      "input-unsupported": text.videoInputUnsupported,
      "output-unsupported": text.videoOutputUnsupported,
      "video-too-large": text.videoTooLarge,
      "video-too-long": text.videoTooLong,
      "video-duration-unavailable": text.videoDurationUnavailable,
      "video-resolution-too-large": text.videoResolutionTooLarge,
      "video-conversion-failed": text.videoConversionFailed,
    };
    return videoErrors[error.code];
  }
  if (isAudioConversionErrorCode(error)) {
    const audioErrors: Record<AudioConversionErrorCode, string> = {
      "worker-unsupported": text.audioWorkerUnsupported,
      "input-unsupported": text.audioInputUnsupported,
      "output-unsupported": text.audioOutputUnsupported,
      "audio-too-large": text.audioTooLarge,
      "audio-too-long": text.audioTooLong,
      "audio-duration-unavailable": text.audioDurationUnavailable,
      "audio-wav-too-large": text.audioWavTooLarge,
      "audio-conversion-failed": text.audioConversionFailed,
    };
    return audioErrors[error.code];
  }
  if (!isImageConversionErrorCode(error)) return error.message;

  const imageErrors: Record<ImageConversionErrorCode, string> = {
    "worker-unsupported": text.imageWorkerUnsupported,
    "input-unsupported": text.imageInputUnsupported,
    "output-unsupported": text.imageOutputUnsupported,
    "invalid-svg": text.invalidSvg,
    "svg-unsupported": text.svgUnsupported,
    "svg-dimensions-missing": text.svgDimensionsMissing,
    "image-too-large": text.imageTooLarge,
    "conversion-failed": text.imageConversionFailed,
  };
  return imageErrors[error.code];
}

function isImageConversionErrorCode(
  error: Error,
): error is Error & { code: ImageConversionErrorCode } {
  if (!("code" in error) || typeof error.code !== "string") return false;
  return [
    "worker-unsupported",
    "input-unsupported",
    "output-unsupported",
    "invalid-svg",
    "svg-unsupported",
    "svg-dimensions-missing",
    "image-too-large",
    "conversion-failed",
  ].includes(error.code);
}

function isImageFormat(value: ConversionTarget): value is ImageFormat {
  return ["image/jpeg", "image/png", "image/webp", "image/avif"].some(
    (format) => format === value,
  );
}

function isPdfFormat(value: ConversionTarget): value is PdfFormat {
  return ["image/png", "image/jpeg", "text/plain"].some(
    (format) => format === value,
  );
}

function isDocumentFormat(value: ConversionTarget): value is DocumentFormat {
  return ["text/html", "text/plain", "text/markdown"].some(
    (format) => format === value,
  );
}

function isVideoFormat(value: ConversionTarget): value is VideoFormat {
  return value === "video/mp4" || value === "video/webm";
}

function isAudioFormat(value: ConversionTarget): value is AudioFormat {
  return value === "audio/mpeg" || value === "audio/wav";
}

function isVideoConversionErrorCode(
  error: Error,
): error is Error & { code: VideoConversionErrorCode } {
  if (!("code" in error) || typeof error.code !== "string") return false;
  return [
    "worker-unsupported",
    "input-unsupported",
    "output-unsupported",
    "video-too-large",
    "video-too-long",
    "video-duration-unavailable",
    "video-resolution-too-large",
    "video-conversion-failed",
  ].includes(error.code);
}

function isAudioConversionErrorCode(
  error: Error,
): error is Error & { code: AudioConversionErrorCode } {
  if (!("code" in error) || typeof error.code !== "string") return false;
  return [
    "worker-unsupported",
    "input-unsupported",
    "output-unsupported",
    "audio-too-large",
    "audio-too-long",
    "audio-duration-unavailable",
    "audio-wav-too-large",
    "audio-conversion-failed",
  ].includes(error.code);
}
