import { AudioConversionError } from "../audio/errors";
import { VideoConversionError } from "../video/errors";
import type { AudioFormat, AudioConversionErrorCode } from "../audio/types";
import type { VideoFormat, VideoConversionErrorCode } from "../video/types";

type MediaKind = "audio" | "video";
type MediaFormat = AudioFormat | VideoFormat;
type WorkerResponse =
  | { type: "progress"; progress: number }
  | { type: "result"; buffer: ArrayBuffer }
  | { type: "error"; code: string };

export function convertMediaInWorker(
  kind: MediaKind,
  file: File,
  target: MediaFormat,
  onProgress: (progress: number) => void,
): Promise<Blob> {
  const worker = createMediaWorker(kind);
  return new Promise((resolve, reject) => {
    const finish = () => worker.terminate();
    worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
      const response = event.data;
      if (response.type === "progress") {
        onProgress(response.progress);
      } else if (response.type === "result") {
        finish();
        resolve(new Blob([response.buffer], { type: target }));
      } else {
        finish();
        reject(toConversionError(kind, response.code));
      }
    };
    worker.onerror = () => {
      finish();
      reject(toConversionError(kind, "conversion-failed"));
    };
    try {
      worker.postMessage({ type: "convert", kind, file, target });
    } catch {
      finish();
      reject(toConversionError(kind, "conversion-failed"));
    }
  });
}

function createMediaWorker(kind: MediaKind): Worker {
  try {
    return new Worker(new URL("./worker.ts", import.meta.url), {
      type: "module",
      name: `henka-${kind}-conversion`,
    });
  } catch {
    throw toConversionError(kind, "worker-unsupported");
  }
}

function toConversionError(
  kind: MediaKind,
  code: string,
): AudioConversionError | VideoConversionError {
  if (kind === "audio") {
    const validCode = isAudioErrorCode(code) ? code : "audio-conversion-failed";
    return new AudioConversionError(validCode);
  }
  const validCode = isVideoErrorCode(code) ? code : "video-conversion-failed";
  return new VideoConversionError(validCode);
}

function isAudioErrorCode(code: string): code is AudioConversionErrorCode {
  return [
    "worker-unsupported",
    "input-unsupported",
    "output-unsupported",
    "audio-too-large",
    "audio-too-long",
    "audio-duration-unavailable",
    "audio-output-too-large",
    "audio-conversion-failed",
  ].includes(code);
}

function isVideoErrorCode(code: string): code is VideoConversionErrorCode {
  return [
    "worker-unsupported",
    "input-unsupported",
    "output-unsupported",
    "video-too-large",
    "video-too-long",
    "video-duration-unavailable",
    "video-output-too-large",
    "video-resolution-too-large",
    "video-conversion-failed",
  ].includes(code);
}
