import type { Language, messages } from "$lib/i18n/messages";
import { DocumentConversionError } from "./documents/errors";
import type {
  DocumentConversionErrorCode,
  DocumentFormat,
} from "./documents/types";
import { DOCUMENT_FORMATS } from "./documents/formats";
import { ImageConversionError } from "./image/errors";
import type {
  ImageConversionErrorCode,
  ImageFormat,
  ImageTargetFormat,
} from "./image/types";
import type { PdfFormat, PdfImageFormat } from "./pdf/types";
import type { VideoConversionErrorCode, VideoFormat } from "./video/types";
import type { AudioConversionErrorCode, AudioFormat } from "./audio/types";
import { AUDIO_FORMATS } from "./audio/formats";
import { VIDEO_FORMATS } from "./video/formats";
import { type DataConversionErrorCode, type DataFormat } from "./data/types";
import { DataConversionError } from "./data/errors";
import { DATA_FORMATS } from "./data/formats";
import { IMAGE_OUTPUT_FORMATS } from "./image/formats";
import { PDF_IMAGE_FORMATS } from "./pdf/types";
import { PdfConversionError } from "./pdf/errors";
import type { ConversionOutput, FileJob } from "./shared/types";
import { VideoConversionError } from "./video/errors";
import { AudioConversionError } from "./audio/errors";

export type ConversionTarget =
  | ImageTargetFormat
  | PdfFormat
  | DocumentFormat
  | VideoFormat
  | AudioFormat
  | DataFormat;
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
    if (options.target === "application/pdf") {
      const { convertImageToPdf } = await import("./pdf/convert");
      onProgress(20);
      const output = await convertImageToPdf(
        job.file,
        options.quality,
        options.svgOutputWidth,
      );
      onProgress(100);
      return [output];
    }
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

  if (job.kind === "data") {
    if (!isDataFormat(options.target)) {
      throw new Error(options.text.dataConversionFailed);
    }
    const { convertData } = await import("./data/convert");
    return [
      await convertData(
        job.file,
        options.target,
        onProgress,
        job.selectedWorksheet,
      ),
    ];
  }

  if (job.kind === "docx") {
    if (!isDocumentFormat(options.target)) {
      throw new Error(options.text.errorPrefix);
    }
    const { convertDocument } = await import("./documents/convert");
    onProgress(20);
    const output = await convertDocument(
      job.file,
      options.target,
      options.language,
      onProgress,
    );
    onProgress(100);
    return [output];
  }
  throw new Error(options.text.errorPrefix);
}

export function getConversionErrorMessage(
  error: unknown,
  text: WorkspaceText,
): string {
  if (!(error instanceof Error)) return text.errorPrefix;
  if (error instanceof PdfConversionError) {
    if (error.code === "no-selectable-text") return text.pdfNoSelectableText;
    return text.pdfPageImageUnavailable;
  }
  if (error instanceof DocumentConversionError) {
    const documentErrors: Record<DocumentConversionErrorCode, string> = {
      "worker-unsupported": text.documentWorkerUnsupported,
      "document-too-large": text.documentTooLarge,
      "document-output-too-large": text.documentOutputTooLarge,
      "document-input-unsupported": text.documentInputUnsupported,
      "document-conversion-failed": text.documentConversionFailed,
    };
    return documentErrors[error.code];
  }
  if (error instanceof VideoConversionError) {
    const videoErrors: Record<VideoConversionErrorCode, string> = {
      "worker-unsupported": text.videoWorkerUnsupported,
      "input-unsupported": text.videoInputUnsupported,
      "output-unsupported": text.videoOutputUnsupported,
      "video-too-large": text.videoTooLarge,
      "video-too-long": text.videoTooLong,
      "video-duration-unavailable": text.videoDurationUnavailable,
      "video-output-too-large": text.videoOutputTooLarge,
      "video-resolution-too-large": text.videoResolutionTooLarge,
      "video-conversion-failed": text.videoConversionFailed,
    };
    return videoErrors[error.code];
  }
  if (error instanceof AudioConversionError) {
    const audioErrors: Record<AudioConversionErrorCode, string> = {
      "worker-unsupported": text.audioWorkerUnsupported,
      "input-unsupported": text.audioInputUnsupported,
      "output-unsupported": text.audioOutputUnsupported,
      "audio-too-large": text.audioTooLarge,
      "audio-too-long": text.audioTooLong,
      "audio-duration-unavailable": text.audioDurationUnavailable,
      "audio-output-too-large": text.audioOutputTooLarge,
      "audio-conversion-failed": text.audioConversionFailed,
    };
    return audioErrors[error.code];
  }
  if (error instanceof DataConversionError) {
    const dataErrors: Record<DataConversionErrorCode, string> = {
      "worker-unsupported": text.dataWorkerUnsupported,
      "data-too-large": text.dataTooLarge,
      "data-output-too-large": text.dataOutputTooLarge,
      "data-invalid-input": text.dataInvalidInput,
      "data-invalid-headers": text.dataInvalidHeaders,
      "data-json-structure-unsupported": text.dataJsonStructureUnsupported,
      "data-sheet-selection-required": text.dataSheetSelectionRequired,
      "data-sheet-unavailable": text.dataSheetUnavailable,
      "data-sheet-too-large": text.dataSheetTooLarge,
      "data-conversion-failed": text.dataConversionFailed,
    };
    return dataErrors[error.code];
  }
  if (!(error instanceof ImageConversionError)) return error.message;

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

function isImageFormat(value: ConversionTarget): value is ImageFormat {
  return IMAGE_OUTPUT_FORMATS.some(
    (format) => format.value === value && format.value !== "application/pdf",
  );
}

function isPdfFormat(value: ConversionTarget): value is PdfFormat {
  return (
    value === "text/plain" ||
    PDF_IMAGE_FORMATS.includes(value as PdfImageFormat)
  );
}

function isDocumentFormat(value: ConversionTarget): value is DocumentFormat {
  return DOCUMENT_FORMATS.includes(value as DocumentFormat);
}

function isVideoFormat(value: ConversionTarget): value is VideoFormat {
  return VIDEO_FORMATS.includes(value as VideoFormat);
}

function isAudioFormat(value: ConversionTarget): value is AudioFormat {
  return AUDIO_FORMATS.includes(value as AudioFormat);
}

function isDataFormat(value: ConversionTarget): value is DataFormat {
  return DATA_FORMATS.includes(value as DataFormat);
}
