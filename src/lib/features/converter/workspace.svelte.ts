import type { DocumentFormat } from "./documents/types";
import type { ImageFormat } from "./image/types";
import type { PdfFormat } from "./pdf/types";
import type { VideoFormat } from "./video/types";
import type { AudioFormat } from "./audio/types";
import type { Language } from "$lib/i18n/messages";
import type { messages } from "$lib/i18n/messages";
import { getConversionErrorMessage, runConversion } from "./run-conversion";
import { isSupportedFile } from "./shared/files";
import type { ConversionOutput, ConverterKind, FileJob } from "./shared/types";

type OutputTarget =
  ImageFormat | PdfFormat | DocumentFormat | VideoFormat | AudioFormat;
export type WorkspaceText = (typeof messages)[Language];

interface WorkspaceState {
  kind: ConverterKind;
  target: OutputTarget;
  quality: number;
  svgOutputWidth: number;
  imageOutputs: ImageFormat[];
  imageCapabilitiesReady: boolean;
  videoOutputs: VideoFormat[];
  videoCapabilitiesReady: boolean;
  videoCapabilitiesLoading: boolean;
  audioOutputs: AudioFormat[];
  audioCapabilitiesReady: boolean;
  audioCapabilitiesLoading: boolean;
  jobs: FileJob[];
  invalidFiles: boolean;
  downloadError: string;
  isConverting: boolean;
}

const pdfFormats: PdfFormat[] = ["image/png", "image/jpeg", "text/plain"];
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
    imageOutputs: [],
    imageCapabilitiesReady: false,
    videoOutputs: [],
    videoCapabilitiesReady: false,
    videoCapabilitiesLoading: false,
    audioOutputs: [],
    audioCapabilitiesReady: false,
    audioCapabilitiesLoading: false,
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

  async function loadImageCapabilities() {
    try {
      const { getImageOutputFormats } = await import("./image/convert");
      state.imageOutputs = await getImageOutputFormats();
      if (
        state.kind === "image" &&
        (!isImageFormat(state.target) ||
          !state.imageOutputs.includes(state.target))
      ) {
        state.target = state.imageOutputs[0] ?? "image/png";
      }
    } catch {
      state.imageOutputs = [];
    } finally {
      state.imageCapabilitiesReady = true;
    }
  }

  async function loadVideoCapabilities() {
    if (state.videoCapabilitiesReady || state.videoCapabilitiesLoading) return;
    state.videoCapabilitiesLoading = true;
    try {
      const { getVideoOutputFormats } = await import("./video/worker-client");
      state.videoOutputs = await getVideoOutputFormats();
      if (
        state.kind === "video" &&
        (!isVideoFormat(state.target) ||
          !state.videoOutputs.includes(state.target))
      ) {
        state.target = state.videoOutputs[0] ?? "video/mp4";
      }
    } catch {
      state.videoOutputs = [];
    } finally {
      state.videoCapabilitiesReady = true;
      state.videoCapabilitiesLoading = false;
    }
  }

  async function loadAudioCapabilities() {
    if (state.audioCapabilitiesReady || state.audioCapabilitiesLoading) return;
    state.audioCapabilitiesLoading = true;
    try {
      const { getAudioOutputFormats } = await import("./audio/worker-client");
      state.audioOutputs = await getAudioOutputFormats();
      if (
        state.kind === "audio" &&
        (!isAudioFormat(state.target) ||
          !state.audioOutputs.includes(state.target))
      ) {
        state.target = state.audioOutputs.includes("audio/mpeg")
          ? "audio/mpeg"
          : (state.audioOutputs[0] ?? "audio/wav");
      }
    } catch {
      state.audioOutputs = [];
    } finally {
      state.audioCapabilitiesReady = true;
      state.audioCapabilitiesLoading = false;
    }
  }

  function selectKind(kind: ConverterKind) {
    state.kind = kind;
    if (kind === "video") void loadVideoCapabilities();
    if (kind === "audio") void loadAudioCapabilities();
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
              ? state.videoOutputs.includes("video/mp4")
                ? "video/mp4"
                : (state.videoOutputs[0] ?? "video/mp4")
              : state.audioOutputs.includes("audio/mpeg")
                ? "audio/mpeg"
                : (state.audioOutputs[0] ?? "audio/wav");
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
    const additions: FileJob[] = supported.map((file) => ({
      id: crypto.randomUUID(),
      kind: state.kind,
      file,
      status: "ready",
      progress: 0,
      outputs: [],
    }));
    state.jobs = [...state.jobs, ...additions];
    state.downloadError = "";
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
    loadImageCapabilities,
    loadVideoCapabilities,
    loadAudioCapabilities,
    selectKind,
    selectTarget,
    setQuality,
    setSvgOutputWidth,
    addFiles,
    removeJob,
    clearCurrentJobs,
    convertAll,
    setDownloadError(value: string) {
      state.downloadError = value;
    },
  };
}

function isImageFormat(value: string): value is ImageFormat {
  return ["image/jpeg", "image/png", "image/webp", "image/avif"].includes(
    value,
  );
}

function isPdfFormat(value: string): value is PdfFormat {
  return pdfFormats.some((format) => format === value);
}

function isDocumentFormat(value: string): value is DocumentFormat {
  return documentFormats.some((format) => format === value);
}

function isVideoFormat(value: string): value is VideoFormat {
  return value === "video/mp4" || value === "video/webm";
}

function isAudioFormat(value: string): value is AudioFormat {
  return value === "audio/mpeg" || value === "audio/wav";
}
