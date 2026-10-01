interface ImageWorkerRequest {
  file: File;
  target: "image/jpeg" | "image/png" | "image/webp";
  quality: number;
  background: string;
}

const workerScope = self as unknown as {
  addEventListener: (
    type: "message",
    listener: (event: MessageEvent<ImageWorkerRequest>) => void,
  ) => void;
  postMessage: (message: unknown) => void;
};

workerScope.addEventListener("message", async ({ data }) => {
  let bitmap: ImageBitmap | undefined;
  try {
    if (typeof OffscreenCanvas === "undefined") {
      throw new Error(
        "This browser does not support image conversion in a worker.",
      );
    }

    if (
      /\.(heic|heif)$/i.test(data.file.name) ||
      /image\/(heic|heif)/i.test(data.file.type)
    ) {
      const { heicTo } = await import("heic-to/next");
      bitmap = await heicTo({ blob: data.file, type: "bitmap" });
    } else {
      bitmap = await createImageBitmap(data.file);
    }

    const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Could not create an image canvas.");
    if (data.target === "image/jpeg") {
      context.fillStyle = data.background;
      context.fillRect(0, 0, canvas.width, canvas.height);
    }
    context.drawImage(bitmap, 0, 0);
    bitmap.close();
    bitmap = undefined;

    const blob = await canvas.convertToBlob({
      type: data.target,
      quality: data.target === "image/png" ? undefined : data.quality,
    });
    if (blob.type !== data.target)
      throw new Error("This browser cannot create that image format.");
    workerScope.postMessage({
      ok: true,
      blob,
      width: canvas.width,
      height: canvas.height,
    });
  } catch (error) {
    bitmap?.close();
    workerScope.postMessage({
      ok: false,
      error:
        error instanceof Error ? error.message : "Image conversion failed.",
    });
  }
});
