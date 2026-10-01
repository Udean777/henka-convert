import { createVideoOutput, convertVideoInWorker } from "./worker-client";
import type { VideoFormat } from "./types";

export async function convertVideo(
  file: File,
  target: VideoFormat,
  onProgress: (progress: number) => void,
) {
  const blob = await convertVideoInWorker(file, target, onProgress);
  return createVideoOutput(file, blob, target);
}
