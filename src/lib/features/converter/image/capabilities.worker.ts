import type { ImageFormat } from "./types";

const outputFormats: ImageFormat[] = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/avif",
];

self.addEventListener("message", () => {
  if (
    typeof OffscreenCanvas === "undefined" ||
    typeof WebAssembly === "undefined"
  ) {
    self.postMessage({
      type: "capabilities",
      formats: [] satisfies ImageFormat[],
    });
    return;
  }
  const canvas = new OffscreenCanvas(1, 1);
  self.postMessage({
    type: "capabilities",
    formats: canvas.getContext("2d") ? outputFormats : [],
  });
});
