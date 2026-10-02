import { removeExtension } from "../shared/files";
import { getAudioExtension } from "./formats";
import { convertMediaInWorker } from "../media/worker-client";
import type { AudioFormat } from "./types";

export function convertAudioInWorker(
  file: File,
  target: AudioFormat,
  onProgress: (progress: number) => void,
): Promise<Blob> {
  return convertMediaInWorker("audio", file, target, onProgress);
}

export function createAudioOutput(file: File, blob: Blob, target: AudioFormat) {
  return {
    name: `${removeExtension(file.name)}${getAudioExtension(target)}`,
    blob,
  };
}
