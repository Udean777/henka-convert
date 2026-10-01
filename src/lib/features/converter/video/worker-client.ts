import { removeExtension } from "../shared/files";
import { getVideoExtension } from "./formats";
import { convertMediaInWorker } from "../media/worker-client";
import type { VideoFormat } from "./types";

export function convertVideoInWorker(
  file: File,
  target: VideoFormat,
  onProgress: (progress: number) => void,
): Promise<Blob> {
  return convertMediaInWorker("video", file, target, onProgress);
}

export function createVideoOutput(file: File, blob: Blob, target: VideoFormat) {
  return {
    name: `${removeExtension(file.name)}${getVideoExtension(target)}`,
    blob,
  };
}
