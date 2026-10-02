import avifDecoderWasm from "@jsquash/avif/codec/dec/avif_dec.wasm?url";
import avifEncoderWasm from "@jsquash/avif/codec/enc/avif_enc.wasm?url";
import avifEncoderMtWasm from "@jsquash/avif/codec/enc/avif_enc_mt.wasm?url";
import jpegDecoderWasm from "@jsquash/jpeg/codec/dec/mozjpeg_dec.wasm?url";
import jpegEncoderWasm from "@jsquash/jpeg/codec/enc/mozjpeg_enc.wasm?url";
import pngWasm from "@jsquash/png/codec/pkg/squoosh_png_bg.wasm?url";
import webpDecoderWasm from "@jsquash/webp/codec/dec/webp_dec.wasm?url";
import webpEncoderWasm from "@jsquash/webp/codec/enc/webp_enc.wasm?url";
import webpEncoderSimdWasm from "@jsquash/webp/codec/enc/webp_enc_simd.wasm?url";
import jxlDecoderWasm from "@jsquash/jxl/codec/dec/jxl_dec.wasm?url";
import jxlEncoderWasm from "@jsquash/jxl/codec/enc/jxl_enc.wasm?url";
import jxlEncoderMtWasm from "@jsquash/jxl/codec/enc/jxl_enc_mt.wasm?url";
import jxlEncoderMtSimdWasm from "@jsquash/jxl/codec/enc/jxl_enc_mt_simd.wasm?url";
import type { WasmImageFormat } from "./types";

type CodecFormat = "jpeg" | "png" | "webp" | "avif" | "jxl";

export async function decodeWithWasm(
  source: Blob,
  file: File,
): Promise<ImageData> {
  const format = getCodecFormat(file);
  if (!format) throw new Error("Unsupported image input");
  const buffer = await source.arrayBuffer();

  try {
    switch (format) {
      case "jpeg": {
        const codec = await import("@jsquash/jpeg/decode");
        await codec.init({ locateFile: () => jpegDecoderWasm });
        return await codec.default(buffer);
      }
      case "png": {
        const codec = await import("@jsquash/png/decode");
        await codec.init(pngWasm);
        const decoded = await codec.default(buffer);
        if (!decoded) throw new Error("PNG decode failed");
        return decoded;
      }
      case "webp": {
        const codec = await import("@jsquash/webp/decode");
        await codec.init({ locateFile: () => webpDecoderWasm });
        return await codec.default(buffer);
      }
      case "avif": {
        const codec = await import("@jsquash/avif/decode");
        await codec.init({ locateFile: () => avifDecoderWasm });
        const decoded = await codec.default(buffer);
        if (!decoded || !(decoded.data instanceof Uint8ClampedArray)) {
          throw new Error("Unsupported AVIF bit depth");
        }
        return decoded;
      }
      case "jxl": {
        const codec = await import("@jsquash/jxl/decode");
        await codec.init({ locateFile: () => jxlDecoderWasm });
        return await codec.default(buffer);
      }
    }
  } catch {
    throw new Error("Could not decode image input");
  }
}

export async function encodeWithWasm(
  imageData: ImageData,
  target: WasmImageFormat,
  quality: number,
): Promise<ArrayBuffer> {
  switch (target) {
    case "image/jpeg": {
      const codec = await import("@jsquash/jpeg/encode");
      await codec.init({ locateFile: () => jpegEncoderWasm });
      return codec.default(imageData, { quality: Math.round(quality * 100) });
    }
    case "image/png": {
      const codec = await import("@jsquash/png/encode");
      await codec.init(pngWasm);
      return codec.default(imageData);
    }
    case "image/webp": {
      const codec = await import("@jsquash/webp/encode");
      await codec.init({
        locateFile: (path: string) =>
          path.includes("simd") ? webpEncoderSimdWasm : webpEncoderWasm,
      });
      return codec.default(imageData, { quality: Math.round(quality * 100) });
    }
    case "image/avif": {
      const codec = await import("@jsquash/avif/encode");
      await codec.init({
        locateFile: (path: string) =>
          path.includes("_mt") ? avifEncoderMtWasm : avifEncoderWasm,
      });
      return codec.default(imageData, { quality: Math.round(quality * 100) });
    }
    case "image/jxl": {
      const codec = await import("@jsquash/jxl/encode");
      await codec.init({
        locateFile: (path: string) =>
          path.includes("_mt_simd")
            ? jxlEncoderMtSimdWasm
            : path.includes("_mt")
              ? jxlEncoderMtWasm
              : jxlEncoderWasm,
      });
      return codec.default(imageData, { quality: Math.round(quality * 100) });
    }
    default:
      throw new Error("Unsupported WebAssembly image output");
  }
}

function getCodecFormat(file: File): CodecFormat | undefined {
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  if (/\.jpe?g$/.test(name) || type === "image/jpeg") return "jpeg";
  if (/\.png$/.test(name) || type === "image/png") return "png";
  if (/\.webp$/.test(name) || type === "image/webp") return "webp";
  if (/\.avif$/.test(name) || type === "image/avif") return "avif";
  if (/\.jxl$/.test(name) || type === "image/jxl") return "jxl";
  return undefined;
}
