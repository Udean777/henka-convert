import type { DocumentFormat } from "./documents/types";
import type { ImageTargetFormat } from "./image/types";
import { IMAGE_OUTPUT_FORMATS } from "./image/formats";
import type { PdfFormat } from "./pdf/types";
import { PDF_IMAGE_FORMATS } from "./pdf/types";
import type { VideoFormat } from "./video/types";
import type { AudioFormat } from "./audio/types";
import { AUDIO_FORMATS } from "./audio/formats";
import { VIDEO_FORMATS } from "./video/formats";
import {
  DATA_FORMATS,
  getDataFormatFromFilename,
  isWorkbookFormat,
} from "./data/formats";
import type { DataFormat } from "./data/types";
import { inspectSpreadsheetInWorker } from "./data/worker-client";
import type { Language } from "$lib/i18n/messages";
import type { messages } from "$lib/i18n/messages";
import { getConversionErrorMessage, runConversion } from "./run-conversion";
import { isSupportedFile } from "./shared/files";
import type { ConversionOutput, ConverterKind, FileJob } from "./shared/types";

type OutputTarget =
  | ImageTargetFormat
  | PdfFormat
  | DocumentFormat
  | VideoFormat
  | AudioFormat
  | DataFormat;
export type WorkspaceText = (typeof messages)[Language];

interface WorkspaceState {
  kind: ConverterKind;
  target: OutputTarget;
  quality: number;
  svgOutputWidth: number;
  imageOutputs: ImageTargetFormat[];
  jobs: FileJob[];
  invalidFiles: boolean;
  downloadError: string;
  isConverting: boolean;
}

const pdfFormats: PdfFormat[] = [...PDF_IMAGE_FORMATS, "text/plain"];
const documentFormats: DocumentFormat[] = [
  "text/html",
  "text/plain",
  "text/markdown",
];

export function createConverterWorkspace(
  getText: () => WorkspaceText,
  getLanguage: () => Language,
) {
  const state = $state<WorkspaceState>({
    kind: "image",
    target: "image/webp",
    quality: 0.9,
    svgOutputWidth: 1024,
    imageOutputs: IMAGE_OUTPUT_FORMATS.map((format) => format.value),
    jobs: [],
    invalidFiles: false,
    downloadError: "",
    isConverting: false,
  });

  const currentJobs = () => state.jobs.filter((job) => job.kind === state.kind);
  const finishedOutputs = () =>
    currentJobs().flatMap((job) => (job.status === "done" ? job.outputs : []));
  const busy = () =>
    state.isConverting || state.jobs.some((job) => job.status === "converting");

  function selectKind(kind: ConverterKind) {
    state.kind = kind;
    state.target =
      kind === "image"
        ? state.imageOutputs.includes("image/webp")
          ? "image/webp"
          : (state.imageOutputs[0] ?? "image/png")
        : kind === "pdf"
          ? "image/png"
          : kind === "docx"
            ? "text/html"
            : kind === "video"
              ? VIDEO_FORMATS[0]
              : kind === "audio"
                ? AUDIO_FORMATS[0]
                : "application/json";
    state.invalidFiles = false;
  }

  function selectTarget(value: string) {
    if (state.kind === "image" && isImageFormat(value)) {
      state.target = value;
    } else if (state.kind === "pdf" && isPdfFormat(value)) {
      state.target = value;
    } else if (state.kind === "docx" && isDocumentFormat(value)) {
      state.target = value;
    } else if (state.kind === "video" && isVideoFormat(value)) {
      state.target = value;
    } else if (state.kind === "audio" && isAudioFormat(value)) {
      state.target = value;
    } else if (state.kind === "data" && isDataFormat(value)) {
      state.target = value;
    }
  }

  function setQuality(value: number) {
    state.quality = value;
  }

  function setSvgOutputWidth(value: number) {
    state.svgOutputWidth = value;
  }

  function addFiles(files: File[]) {
    const supported = files.filter((file) => isSupportedFile(file, state.kind));
    state.invalidFiles = supported.length !== files.length;
    const additions: FileJob[] = supported.map((file) => {
      const format =
        state.kind === "data" ? getDataFormatFromFilename(file.name) : null;
      const inspectWorkbook = format !== null && isWorkbookFormat(format);
      return {
        id: crypto.randomUUID(),
        kind: state.kind,
        file,
        status: "ready",
        progress: 0,
        outputs: [],
        ...(inspectWorkbook ? { worksheetNamesLoading: true } : {}),
      };
    });
    state.jobs = [...state.jobs, ...additions];
    state.downloadError = "";
    for (const job of additions) {
      if (job.worksheetNamesLoading) void loadWorksheetNames(job);
    }
  }

  async function loadWorksheetNames(job: FileJob) {
    try {
      const worksheetNames = await inspectSpreadsheetInWorker(job.file);
      if (worksheetNames.length === 0) {
        throw new Error(getText().dataInvalidInput);
      }
      updateJob(job.id, {
        worksheetNames,
        worksheetNamesLoading: false,
        selectedWorksheet:
          worksheetNames.length === 1 ? worksheetNames[0] : undefined,
      });
    } catch (error) {
      updateJob(job.id, {
        status: "error",
        worksheetNamesLoading: false,
        error: getConversionErrorMessage(error, getText()),
      });
    }
  }

  function selectWorksheet(id: string, worksheetName: string) {
    const job = state.jobs.find((item) => item.id === id);
    if (!job?.worksheetNames?.includes(worksheetName)) return;
    updateJob(id, {
      selectedWorksheet: worksheetName,
      status: "ready",
      progress: 0,
      outputs: [],
      error: undefined,
    });
  }

  function updateJob(id: string, update: Partial<FileJob>) {
    state.jobs = state.jobs.map((job) =>
      job.id === id ? { ...job, ...update } : job,
    );
  }

  function removeJob(id: string) {
    state.jobs = state.jobs.filter((job) => job.id !== id);
  }

  function clearCurrentJobs() {
    state.jobs = state.jobs.filter((job) => job.kind !== state.kind);
  }

  async function convertAll() {
    if (busy()) return;
    state.isConverting = true;
    state.downloadError = "";
    try {
      const pending = currentJobs().filter(
        (job) => job.status === "ready" || job.status === "error",
      );
      for (const job of pending) {
        updateJob(job.id, {
          status: "converting",
          progress: 0,
          error: undefined,
          outputs: [],
        });
        try {
          const outputs = await convertFile(job, (progress) =>
            updateJob(job.id, { progress }),
          );
          updateJob(job.id, { status: "done", progress: 100, outputs });
        } catch (error) {
          updateJob(job.id, {
            status: "error",
            progress: 0,
            error: getConversionErrorMessage(error, getText()),
          });
        }
      }
    } finally {
      state.isConverting = false;
    }
  }

  async function convertFile(
    job: FileJob,
    onProgress: (progress: number) => void,
  ): Promise<ConversionOutput[]> {
    return runConversion(
      job,
      {
        target: state.target,
        quality: state.quality,
        svgOutputWidth: state.svgOutputWidth,
        language: getLanguage(),
        text: getText(),
      },
      onProgress,
    );
  }

  return {
    state,
    currentJobs,
    finishedOutputs,
    busy,
    selectKind,
    selectTarget,
    setQuality,
    setSvgOutputWidth,
    addFiles,
    selectWorksheet,
    removeJob,
    clearCurrentJobs,
    convertAll,
    setDownloadError(value: string) {
      state.downloadError = value;
    },
  };
}

function isImageFormat(value: string): value is ImageTargetFormat {
  return IMAGE_OUTPUT_FORMATS.some((format) => format.value === value);
}

function isPdfFormat(value: string): value is PdfFormat {
  return pdfFormats.some((format) => format === value);
}

function isDocumentFormat(value: string): value is DocumentFormat {
  return documentFormats.some((format) => format === value);
}

function isVideoFormat(value: string): value is VideoFormat {
  return VIDEO_FORMATS.includes(value as VideoFormat);
}

function isAudioFormat(value: string): value is AudioFormat {
  return AUDIO_FORMATS.includes(value as AudioFormat);
}

function isDataFormat(value: string): value is DataFormat {
  return DATA_FORMATS.includes(value as DataFormat);
}
