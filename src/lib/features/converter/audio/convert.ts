import { createAudioOutput, convertAudioInWorker } from "./worker-client";
import type { AudioFormat } from "./types";

export async function convertAudio(
  file: File,
  target: AudioFormat,
  onProgress: (progress: number) => void,
) {
  const blob = await convertAudioInWorker(file, target, onProgress);
  return createAudioOutput(file, blob, target);
}
