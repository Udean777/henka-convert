import { zip } from "fflate";
import type { ConversionOutput } from "./types";

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 30_000);
}

export async function downloadOutputs(
  outputs: ConversionOutput[],
  archiveName: string,
) {
  if (outputs.length === 1) {
    downloadBlob(outputs[0].blob, outputs[0].name);
    return;
  }

  const entries: Record<string, Uint8Array> = {};
  for (const output of outputs) {
    const bytes = new Uint8Array(await output.blob.arrayBuffer());
    entries[uniqueName(output.name, entries)] = bytes;
  }

  const archive = await new Promise<Uint8Array>((resolve, reject) => {
    zip(entries, { level: 0 }, (error, data) => {
      if (error) reject(error);
      else resolve(data);
    });
  });

  const archiveBuffer = new Uint8Array(archive.byteLength);
  archiveBuffer.set(archive);
  downloadBlob(
    new Blob([archiveBuffer], { type: "application/zip" }),
    archiveName,
  );
}

function uniqueName(
  name: string,
  existing: Record<string, Uint8Array>,
): string {
  if (!(name in existing)) return name;
  const dot = name.lastIndexOf(".");
  const stem = dot > 0 ? name.slice(0, dot) : name;
  const extension = dot > 0 ? name.slice(dot) : "";
  let index = 2;
  while (`${stem}-${index}${extension}` in existing) index += 1;
  return `${stem}-${index}${extension}`;
}
