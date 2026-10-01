import { encodeImageData } from "./encoders";
import type { RasterImageFormat } from "./types";

interface EncodeRequest {
  imageData: ImageData;
  target: RasterImageFormat;
  quality: number;
}

self.addEventListener(
  "message",
  async ({ data }: MessageEvent<EncodeRequest>) => {
    try {
      const blob = await encodeImageData(
        data.imageData,
        data.target,
        data.quality,
      );
      self.postMessage({ ok: true, blob });
    } catch {
      self.postMessage({ ok: false });
    }
  },
);
