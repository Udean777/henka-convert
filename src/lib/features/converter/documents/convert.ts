import { removeExtension } from "../shared/files";
import type { ConversionOutput } from "../shared/types";
import type { DocumentFormat } from "./types";

export async function convertDocx(
  file: File,
  format: DocumentFormat,
  language: "en" | "id",
): Promise<ConversionOutput> {
  const mammothModule = await import("mammoth");
  const mammoth = mammothModule.default;
  const arrayBuffer = await file.arrayBuffer();
  const base = removeExtension(file.name);

  function formattingNote(messageCount: number): string | undefined {
    if (!messageCount) return undefined;
    return language === "id"
      ? "Beberapa elemen Word, seperti bentuk atau gaya paragraf khusus, mungkin tidak ikut dikonversi."
      : "Some Word elements, such as shapes or custom paragraph styles, may not be included in the conversion.";
  }

  if (format === "text/plain") {
    const result = await mammoth.extractRawText({ arrayBuffer });
    return {
      name: `${base}.txt`,
      blob: new Blob([result.value], { type: "text/plain;charset=utf-8" }),
      note: formattingNote(result.messages.length),
    };
  }

  const result = await mammoth.convertToHtml({ arrayBuffer });
  if (format === "text/html") {
    const standalone = `<!doctype html><html lang="${language}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(base)}</title></head><body>${result.value}</body></html>`;
    return {
      name: `${base}.html`,
      blob: new Blob([standalone], { type: "text/html;charset=utf-8" }),
      note: formattingNote(result.messages.length),
    };
  }

  const { default: TurndownService } = await import("turndown");
  const turndown = new TurndownService({
    headingStyle: "atx",
    codeBlockStyle: "fenced",
  });
  const markdown = turndown.turndown(result.value);
  return {
    name: `${base}.md`,
    blob: new Blob([markdown], { type: "text/markdown;charset=utf-8" }),
    note: formattingNote(result.messages.length),
  };
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });
}
