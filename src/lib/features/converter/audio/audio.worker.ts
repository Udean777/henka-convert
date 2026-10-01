import {
  ALL_FORMATS,
  BlobSource,
  BufferTarget,
  Conversion,
  Input,
  Mp3OutputFormat,
  Output,
  Quality,
  WavOutputFormat,
  canEncodeAudio,
} from "mediabunny";
import {
  MAX_AUDIO_DURATION_SECONDS,
  MAX_AUDIO_FILE_BYTES,
  MAX_AUDIO_WAV_OUTPUT_BYTES,
} from "../shared/limits";
import type { AudioConversionErrorCode, AudioFormat } from "./types";

type WorkerRequest =
  | { type: "capabilities" }
  | { type: "convert"; file: File; target: AudioFormat };

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
  const formats: AudioFormat[] = ["audio/wav"];

  try {
    const { registerMp3Encoder } = await import("@mediabunny/mp3-encoder");
    registerMp3Encoder();
    if (await canEncodeAudio("mp3")) formats.push("audio/mpeg");
  } catch {
    // WAV remains available if the optional MP3 encoder cannot load.
  }

  selfScope.postMessage({ type: "capabilities", formats });
}

async function convert(file: File, target: AudioFormat) {
  let input: Input | undefined;

  try {
    assertFileSize(file);
    if (target === "audio/mpeg") await registerMp3Encoder();

    input = new Input({ formats: ALL_FORMATS, source: new BlobSource(file) });
    const audioTracks = await input.getAudioTracks();
    const audioTrack = audioTracks[0];

    if (!audioTrack || !(await input.canRead())) {
      throw new WorkerAudioError("input-unsupported");
    }

    const [duration, canDecode, sampleRate, numberOfChannels] =
      await Promise.all([
        readDuration(input, audioTracks),
        audioTrack.canDecode(),
        audioTrack.getSampleRate(),
        audioTrack.getNumberOfChannels(),
      ]);

    assertDuration(duration);
    if (!canDecode) throw new WorkerAudioError("input-unsupported");
    if (
      target === "audio/wav" &&
      estimateWavSize(duration, sampleRate, numberOfChannels) >
        MAX_AUDIO_WAV_OUTPUT_BYTES
    ) {
      throw new WorkerAudioError("audio-wav-too-large");
    }

    selfScope.postMessage({ type: "progress", progress: 3 });
    const bufferTarget = new BufferTarget();
    const output = new Output({
      format:
        target === "audio/mpeg" ? new Mp3OutputFormat() : new WavOutputFormat(),
      target: bufferTarget,
    });
    const conversion = await Conversion.init({
      input,
      output,
      tracks: "primary",
      audio:
        target === "audio/mpeg"
          ? {
              codec: "mp3",
              quality: new Quality("medium"),
              forceTranscode: true,
            }
          : { codec: "pcm-s16", forceTranscode: true },
      showWarnings: false,
    });

    if (!conversion.isValid) {
      throw new WorkerAudioError("output-unsupported");
    }

    conversion.onProgress = (progress) => {
      selfScope.postMessage({
        type: "progress",
        progress: Math.min(98, Math.max(3, Math.round(progress * 95) + 3)),
      });
    };
    await conversion.execute();

    const buffer = bufferTarget.buffer;
    if (!buffer) throw new WorkerAudioError("audio-conversion-failed");
    selfScope.postMessage({ type: "result", buffer }, [buffer]);
  } catch (error) {
    const code =
      error instanceof WorkerAudioError
        ? error.code
        : "audio-conversion-failed";
    selfScope.postMessage({ type: "error", code });
  } finally {
    input?.dispose();
  }
}

async function registerMp3Encoder() {
  const { registerMp3Encoder: register } =
    await import("@mediabunny/mp3-encoder");
  register();
}

function assertFileSize(file: File) {
  if (file.size > MAX_AUDIO_FILE_BYTES) {
    throw new WorkerAudioError("audio-too-large");
  }
}

function assertDuration(duration: number) {
  if (duration > MAX_AUDIO_DURATION_SECONDS) {
    throw new WorkerAudioError("audio-too-long");
  }
}

function estimateWavSize(
  duration: number,
  sampleRate: number,
  numberOfChannels: number,
) {
  return Math.ceil(duration * sampleRate * numberOfChannels * 2);
}

async function readDuration(
  input: Input,
  tracks: Awaited<ReturnType<Input["getAudioTracks"]>>,
) {
  let duration = await input.getDurationFromMetadata(tracks);

  if (
    duration === null ||
    !Number.isFinite(duration) ||
    duration <= 0 ||
    duration > MAX_AUDIO_DURATION_SECONDS
  ) {
    try {
      duration = await input.computeDuration(tracks);
    } catch {
      throw new WorkerAudioError("audio-duration-unavailable");
    }
  }

  if (duration === null || !Number.isFinite(duration) || duration <= 0) {
    throw new WorkerAudioError("audio-duration-unavailable");
  }
  return duration;
}

class WorkerAudioError extends Error {
  constructor(readonly code: AudioConversionErrorCode) {
    super(code);
  }
}
