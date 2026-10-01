import {
  ALL_FORMATS,
  BlobSource,
  BufferTarget,
  Conversion,
  Input,
  Mp4OutputFormat,
  Output,
  Quality,
  WebMOutputFormat,
  canEncodeAudio,
  canEncodeVideo,
} from "mediabunny";
import {
  MAX_VIDEO_DIMENSION,
  MAX_VIDEO_DURATION_SECONDS,
  MAX_VIDEO_FILE_BYTES,
  MAX_VIDEO_INPUT_DIMENSION,
  MAX_VIDEO_INPUT_PIXELS,
  MAX_VIDEO_PIXELS,
} from "../shared/limits";
import type { VideoConversionErrorCode, VideoFormat } from "./types";

type WorkerRequest =
  | { type: "capabilities" }
  | { type: "convert"; file: File; target: VideoFormat };

const selfScope = self as unknown as {
  onmessage: ((event: MessageEvent<WorkerRequest>) => void) | null;
  postMessage: (message: unknown, transfer?: Transferable[]) => void;
};

selfScope.onmessage = (event: MessageEvent<WorkerRequest>) => {
  if (event.data.type === "capabilities") {
    void reportCapabilities();
  } else {
    void convert(event.data.file, event.data.target);
  }
};

async function reportCapabilities() {
  const formats: VideoFormat[] = [];

  try {
    const [canEncodeMp4Video, canEncodeMp4Audio] = await Promise.all([
      canEncodeVideo("avc", { width: 1920, height: 1080, frameRate: 30 }),
      canEncodeAudio("aac", { numberOfChannels: 2, sampleRate: 48_000 }),
    ]);
    if (canEncodeMp4Video && canEncodeMp4Audio) formats.push("video/mp4");
  } catch {
    // Browser codec probes can reject when WebCodecs is unavailable.
  }

  try {
    const [canEncodeWebmVideo, canEncodeWebmAudio] = await Promise.all([
      canEncodeVideo("vp8", { width: 1920, height: 1080, frameRate: 30 }),
      canEncodeAudio("opus", { numberOfChannels: 2, sampleRate: 48_000 }),
    ]);
    if (canEncodeWebmVideo && canEncodeWebmAudio) formats.push("video/webm");
  } catch {
    // Browser codec probes can reject when WebCodecs is unavailable.
  }

  selfScope.postMessage({ type: "capabilities", formats });
}

async function convert(file: File, target: VideoFormat) {
  let input: Input | undefined;

  try {
    assertFileSize(file);
    input = new Input({ formats: ALL_FORMATS, source: new BlobSource(file) });
    const videoTracks = await input.getVideoTracks();
    const audioTracks = await input.getAudioTracks();
    const videoTrack = videoTracks[0];

    if (!videoTrack || !(await input.canRead())) {
      throw new WorkerVideoError("input-unsupported");
    }

    const [width, height, duration, videoCanDecode, audioCanDecode] =
      await Promise.all([
        videoTrack.getDisplayWidth(),
        videoTrack.getDisplayHeight(),
        readDuration(input, [...videoTracks, ...audioTracks]),
        videoTrack.canDecode(),
        audioTracks[0]?.canDecode() ?? Promise.resolve(true),
      ]);

    assertVideoMetadata(width, height, duration);
    const outputSize = getOutputSize(width, height);
    if (!videoCanDecode || !audioCanDecode) {
      throw new WorkerVideoError("input-unsupported");
    }

    selfScope.postMessage({ type: "progress", progress: 3 });
    const bufferTarget = new BufferTarget();
    const output = new Output({
      format:
        target === "video/mp4" ? new Mp4OutputFormat() : new WebMOutputFormat(),
      target: bufferTarget,
    });
    const conversion = await Conversion.init({
      input,
      output,
      tracks: "primary",
      video: {
        codec: target === "video/mp4" ? "avc" : "vp8",
        quality: new Quality("medium"),
        forceTranscode: true,
        ...(outputSize ? { ...outputSize, fit: "contain" as const } : {}),
      },
      audio: {
        codec: target === "video/mp4" ? "aac" : "opus",
        quality: new Quality("medium"),
        forceTranscode: true,
      },
      showWarnings: false,
    });

    if (!conversion.isValid) {
      throw new WorkerVideoError("output-unsupported");
    }

    conversion.onProgress = (progress) => {
      selfScope.postMessage({
        type: "progress",
        progress: Math.min(98, Math.max(3, Math.round(progress * 95) + 3)),
      });
    };
    await conversion.execute();

    const buffer = bufferTarget.buffer;
    if (!buffer) throw new WorkerVideoError("video-conversion-failed");
    selfScope.postMessage({ type: "result", buffer }, [buffer]);
  } catch (error) {
    const code =
      error instanceof WorkerVideoError
        ? error.code
        : "video-conversion-failed";
    selfScope.postMessage({ type: "error", code });
  } finally {
    input?.dispose();
  }
}

function assertFileSize(file: File) {
  if (file.size > MAX_VIDEO_FILE_BYTES) {
    throw new WorkerVideoError("video-too-large");
  }
}

function assertVideoMetadata(width: number, height: number, duration: number) {
  if (duration > MAX_VIDEO_DURATION_SECONDS) {
    throw new WorkerVideoError("video-too-long");
  }
  if (
    width <= 0 ||
    height <= 0 ||
    width > MAX_VIDEO_INPUT_DIMENSION ||
    height > MAX_VIDEO_INPUT_DIMENSION ||
    width * height > MAX_VIDEO_INPUT_PIXELS
  ) {
    throw new WorkerVideoError("video-resolution-too-large");
  }
}

function getOutputSize(width: number, height: number) {
  const scale = Math.min(
    1,
    MAX_VIDEO_DIMENSION / width,
    MAX_VIDEO_DIMENSION / height,
    Math.sqrt(MAX_VIDEO_PIXELS / (width * height)),
  );

  if (scale >= 1) return undefined;

  return {
    width: Math.max(2, Math.floor((width * scale) / 2) * 2),
    height: Math.max(2, Math.floor((height * scale) / 2) * 2),
  };
}

async function readDuration(
  input: Input,
  tracks: Awaited<ReturnType<Input["getTracks"]>>,
) {
  let duration = await input.getDurationFromMetadata(tracks);

  if (
    duration === null ||
    !Number.isFinite(duration) ||
    duration <= 0 ||
    duration > MAX_VIDEO_DURATION_SECONDS
  ) {
    try {
      duration = await input.computeDuration(tracks);
    } catch {
      throw new WorkerVideoError("video-duration-unavailable");
    }
  }

  if (duration === null || !Number.isFinite(duration) || duration <= 0) {
    throw new WorkerVideoError("video-duration-unavailable");
  }
  return duration;
}

class WorkerVideoError extends Error {
  constructor(readonly code: VideoConversionErrorCode) {
    super(code);
  }
}
