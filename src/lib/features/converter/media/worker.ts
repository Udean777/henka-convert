import { FFmpeg } from "@ffmpeg/ffmpeg";
import coreUrl from "@ffmpeg/core?url";
import wasmUrl from "@ffmpeg/core/wasm?url";
import { getAudioFormatFromFilename } from "../audio/formats";
import { getVideoFormatFromFilename } from "../video/formats";
import type { AudioFormat } from "../audio/types";
import type { VideoFormat } from "../video/types";
import {
  MAX_AUDIO_DURATION_SECONDS,
  MAX_AUDIO_FILE_BYTES,
  MAX_AUDIO_OUTPUT_BYTES,
  MAX_VIDEO_DURATION_SECONDS,
  MAX_VIDEO_FILE_BYTES,
  MAX_VIDEO_INPUT_DIMENSION,
  MAX_VIDEO_INPUT_PIXELS,
  MAX_VIDEO_OUTPUT_BYTES,
} from "../shared/limits";
import {
  getAudioOutputArguments,
  getOutputExtension,
  getVideoOutputArguments,
} from "./profiles";

type MediaKind = "audio" | "video";
type MediaFormat = AudioFormat | VideoFormat;
type Request = { file: File; kind: MediaKind; target: MediaFormat };
type ErrorCode =
  | "audio-too-large"
  | "audio-too-long"
  | "audio-duration-unavailable"
  | "audio-output-too-large"
  | "audio-conversion-failed"
  | "video-too-large"
  | "video-too-long"
  | "video-duration-unavailable"
  | "video-output-too-large"
  | "video-resolution-too-large"
  | "video-conversion-failed"
  | "input-unsupported";
type Probe = {
  format?: { duration?: string };
  streams?: Array<{
    codec_type?: string;
    width?: number;
    height?: number;
  }>;
};

const workerScope = self as unknown as {
  onmessage: ((event: MessageEvent<Request>) => void) | null;
  postMessage: (message: unknown, transfer?: Transferable[]) => void;
};

workerScope.onmessage = (event) => {
  void convert(event.data);
};

async function convert({ file, kind, target }: Request) {
  const ffmpeg = new FFmpeg();
  try {
    assertInputSize(file, kind);
    const sourceFormat =
      kind === "audio"
        ? getAudioFormatFromFilename(file.name)
        : getVideoFormatFromFilename(file.name);
    if (!sourceFormat) throw mediaError("input-unsupported");

    workerScope.postMessage({ type: "progress", progress: 2 });
    await ffmpeg.load({ coreURL: coreUrl, wasmURL: wasmUrl });
    const sourcePath = `/input${extensionFromName(file.name)}`;
    const outputPath = `/output${getOutputExtension(target)}`;
    await ffmpeg.writeFile(
      sourcePath,
      new Uint8Array(await file.arrayBuffer()),
    );

    const probe = await probeInput(ffmpeg, sourcePath);
    const duration = Number(probe.format?.duration);
    if (!Number.isFinite(duration) || duration <= 0) {
      throw mediaError("duration-unavailable", kind);
    }
    if (duration > maxDuration(kind)) throw mediaError("too-long", kind);

    const streams = probe.streams ?? [];
    const videoStream = streams.find((stream) => stream.codec_type === "video");
    const audioStream = streams.find((stream) => stream.codec_type === "audio");
    if (kind === "audio" && !audioStream) throw mediaError("input-unsupported");
    if (kind === "video") {
      if (!videoStream) throw mediaError("input-unsupported");
      assertVideoInputDimensions(
        videoStream.width ?? 0,
        videoStream.height ?? 0,
      );
    }

    const progressListener = ({ progress }: { progress: number }) => {
      if (!Number.isFinite(progress)) return;
      workerScope.postMessage({
        type: "progress",
        progress: Math.min(97, Math.max(3, Math.round(progress * 94) + 3)),
      });
    };
    ffmpeg.on("progress", progressListener);
    workerScope.postMessage({ type: "progress", progress: 3 });

    const exitCode = await ffmpeg.exec(
      getCommand(kind, target, sourcePath, outputPath, Boolean(audioStream)),
      300_000,
    );
    ffmpeg.off("progress", progressListener);
    if (exitCode !== 0) throw mediaError("conversion-failed", kind);

    const output = await ffmpeg.readFile(outputPath);
    if (typeof output === "string" || output.byteLength === 0) {
      throw mediaError("conversion-failed", kind);
    }
    if (output.byteLength > maxOutputSize(kind)) {
      throw mediaError("output-too-large", kind);
    }
    const buffer = copyToArrayBuffer(output);
    workerScope.postMessage({ type: "result", buffer }, [buffer]);
  } catch (error) {
    workerScope.postMessage({
      type: "error",
      code: isErrorCode(error)
        ? error.code
        : kind === "audio"
          ? "audio-conversion-failed"
          : "video-conversion-failed",
    });
  } finally {
    if (ffmpeg.loaded) ffmpeg.terminate();
  }
}

async function probeInput(ffmpeg: FFmpeg, sourcePath: string): Promise<Probe> {
  const probePath = "/probe.json";
  const exitCode = await ffmpeg.ffprobe(
    [
      "-v",
      "error",
      "-show_entries",
      "format=duration:stream=codec_type,width,height",
      "-of",
      "json",
      sourcePath,
      "-o",
      probePath,
    ],
    30_000,
  );
  if (exitCode !== 0) throw mediaError("input-unsupported");
  try {
    const result = await ffmpeg.readFile(probePath);
    const json =
      typeof result === "string" ? result : new TextDecoder().decode(result);
    return JSON.parse(json) as Probe;
  } catch {
    throw mediaError("input-unsupported");
  }
}

function getCommand(
  kind: MediaKind,
  target: MediaFormat,
  input: string,
  output: string,
  hasAudio: boolean,
): string[] {
  if (kind === "audio") {
    return [
      "-i",
      input,
      "-map",
      "0:a:0",
      "-vn",
      "-sn",
      "-dn",
      "-map_metadata",
      "-1",
      ...getAudioOutputArguments(target as AudioFormat),
      "-fs",
      String(MAX_AUDIO_OUTPUT_BYTES),
      output,
    ];
  }
  return [
    "-i",
    input,
    "-map",
    "0:v:0",
    ...(hasAudio ? ["-map", "0:a:0?"] : []),
    "-sn",
    "-dn",
    "-vf",
    "scale=w='min(1920,iw)':h='min(1080,ih)':force_original_aspect_ratio=decrease:force_divisible_by=2",
    "-threads",
    "1",
    "-map_metadata",
    "-1",
    ...getVideoOutputArguments(target as VideoFormat),
    "-fs",
    String(MAX_VIDEO_OUTPUT_BYTES),
    output,
  ];
}

function assertInputSize(file: File, kind: MediaKind) {
  const maxBytes =
    kind === "audio" ? MAX_AUDIO_FILE_BYTES : MAX_VIDEO_FILE_BYTES;
  if (file.size > maxBytes) throw mediaError("too-large", kind);
}

function assertVideoInputDimensions(width: number, height: number) {
  if (
    width <= 0 ||
    height <= 0 ||
    width > MAX_VIDEO_INPUT_DIMENSION ||
    height > MAX_VIDEO_INPUT_DIMENSION ||
    width * height > MAX_VIDEO_INPUT_PIXELS
  ) {
    throw mediaError("resolution-too-large", "video");
  }
}

function extensionFromName(filename: string): string {
  const match = /\.([a-z0-9]{1,8})$/i.exec(filename);
  return match ? `.${match[1].toLowerCase()}` : ".bin";
}

function maxDuration(kind: MediaKind): number {
  return kind === "audio"
    ? MAX_AUDIO_DURATION_SECONDS
    : MAX_VIDEO_DURATION_SECONDS;
}

function maxOutputSize(kind: MediaKind): number {
  return kind === "audio" ? MAX_AUDIO_OUTPUT_BYTES : MAX_VIDEO_OUTPUT_BYTES;
}

function mediaError(
  code:
    | "input-unsupported"
    | "too-large"
    | "too-long"
    | "duration-unavailable"
    | "output-too-large"
    | "resolution-too-large"
    | "conversion-failed",
  kind: MediaKind = "audio",
): Error & { code: ErrorCode } {
  const codes = {
    audio: {
      "input-unsupported": "input-unsupported",
      "too-large": "audio-too-large",
      "too-long": "audio-too-long",
      "duration-unavailable": "audio-duration-unavailable",
      "output-too-large": "audio-output-too-large",
      "resolution-too-large": "audio-conversion-failed",
      "conversion-failed": "audio-conversion-failed",
    },
    video: {
      "input-unsupported": "input-unsupported",
      "too-large": "video-too-large",
      "too-long": "video-too-long",
      "duration-unavailable": "video-duration-unavailable",
      "output-too-large": "video-output-too-large",
      "resolution-too-large": "video-resolution-too-large",
      "conversion-failed": "video-conversion-failed",
    },
  } as const;
  const scopedCode = codes[kind][code];
  return Object.assign(new Error(scopedCode), { code: scopedCode });
}

function isErrorCode(error: unknown): error is Error & { code: ErrorCode } {
  return (
    error instanceof Error && "code" in error && typeof error.code === "string"
  );
}

function copyToArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  const buffer = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(buffer).set(bytes);
  return buffer;
}
