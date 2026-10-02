import type { DocumentFormat } from "./types";
import { DOCX_FORMAT, getDocumentFormatFromFilename } from "./formats";
import {
  MAX_DOCUMENT_FILE_BYTES,
  MAX_DOCUMENT_OUTPUT_BYTES,
} from "../shared/limits";
import { DocumentConversionError } from "./errors";
import { toHtmlDocument, sanitizeHtml } from "./html";
import { htmlToDocx } from "./to-docx";

type Request = {
  file: File;
  target: DocumentFormat;
  language: "en" | "id";
};

const workerScope = self as unknown as {
  onmessage: ((event: MessageEvent<Request>) => void) | null;
  postMessage: (message: unknown) => void;
};

workerScope.onmessage = (event) => {
  void convert(event.data);
};

async function convert({ file, target, language }: Request) {
  try {
    if (file.size > MAX_DOCUMENT_FILE_BYTES) {
      throw new DocumentConversionError("document-too-large");
    }
    const source = getDocumentFormatFromFilename(file.name);
    if (!source) {
      throw new DocumentConversionError("document-input-unsupported");
    }
    if (source === target) {
      workerScope.postMessage({
        type: "result",
        blob: new Blob([file], { type: target }),
      });
      return;
    }

    workerScope.postMessage({ type: "progress", progress: 10 });
    const contents = await readDocumentContents(file, source, language);
    workerScope.postMessage({ type: "progress", progress: 55 });
    const output = await writeDocumentContents(contents, target, language);
    if (output.blob.size > MAX_DOCUMENT_OUTPUT_BYTES) {
      throw new DocumentConversionError("document-output-too-large");
    }
    workerScope.postMessage({ type: "progress", progress: 95 });
    workerScope.postMessage({ type: "result", ...output });
  } catch (error) {
    workerScope.postMessage({
      type: "error",
      code:
        error instanceof DocumentConversionError
          ? error.code
          : "document-conversion-failed",
    });
  }
}

interface DocumentContents {
  html: string;
  rawText?: string;
  note?: string;
}

async function readDocumentContents(
  file: File,
  source: DocumentFormat,
  language: "en" | "id",
): Promise<DocumentContents> {
  if (source === DOCX_FORMAT) {
    const mammothModule = await import("mammoth");
    const mammoth = mammothModule.default;
    const arrayBuffer = await file.arrayBuffer();
    const [htmlResult, textResult] = await Promise.all([
      mammoth.convertToHtml({ arrayBuffer }),
      mammoth.extractRawText({ arrayBuffer }),
    ]);
    return {
      html: await sanitizeHtml(htmlResult.value),
      rawText: textResult.value,
      ...(htmlResult.messages.length > 0
        ? {
            note:
              language === "id"
                ? "Beberapa gambar atau format teks mungkin tidak ikut dikonversi."
                : "Some images or text formatting may not be included.",
          }
        : {}),
    };
  }

  const text = await file.text();
  return { html: await toHtmlDocument(text, source) };
}

async function writeDocumentContents(
  contents: DocumentContents,
  target: DocumentFormat,
  language: "en" | "id",
): Promise<{ blob: Blob; note?: string }> {
  if (target === DOCX_FORMAT) {
    const blob = await htmlToDocx(contents.html);
    return {
      blob,
      note:
        contents.note ??
        (language === "id"
          ? "DOCX mempertahankan teks dan format dasar. Tata letak dan gambar bisa berubah atau hilang."
          : "DOCX keeps text and basic formatting. Layout and images may look different or be missing."),
    };
  }

  if (target === "text/html") {
    const { body, title } = await htmlParts(contents.html);
    const html = `<!doctype html><html lang="${language}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(title)}</title></head><body>${body}</body></html>`;
    return {
      blob: new Blob([html], { type: "text/html;charset=utf-8" }),
      ...(contents.note ? { note: contents.note } : {}),
    };
  }

  if (target === "text/plain") {
    const text = contents.rawText ?? (await htmlToPlainText(contents.html));
    return {
      blob: new Blob([text], { type: "text/plain;charset=utf-8" }),
      ...(contents.note ? { note: contents.note } : {}),
    };
  }

  const { body } = await htmlParts(contents.html);
  const { default: TurndownService } = await import("turndown");
  const markdown = new TurndownService({
    headingStyle: "atx",
    codeBlockStyle: "fenced",
  }).turndown(body);
  return {
    blob: new Blob([markdown], { type: "text/markdown;charset=utf-8" }),
    ...(contents.note ? { note: contents.note } : {}),
  };
}

async function htmlToPlainText(html: string): Promise<string> {
  const { DOMParser } = await import("linkedom/worker");
  const document = new DOMParser().parseFromString(html, "text/html");
  const output: string[] = [];
  const blocks = new Set([
    "ADDRESS",
    "BLOCKQUOTE",
    "DIV",
    "H1",
    "H2",
    "H3",
    "H4",
    "H5",
    "H6",
    "LI",
    "P",
    "PRE",
    "TR",
  ]);
  const visit = (node: Node) => {
    if (node.nodeType === 3) {
      output.push(node.textContent ?? "");
      return;
    }
    if (node.nodeType !== 1) return;
    const element = node as Element;
    const tag = element.tagName.toUpperCase();
    if (tag === "BR") {
      output.push("\n");
      return;
    }
    const isBlock = blocks.has(tag);
    if (isBlock && output.length && !output.at(-1)?.endsWith("\n")) {
      output.push("\n");
    }
    if (tag === "IMG") {
      output.push(element.getAttribute("alt") ?? "");
    } else {
      for (const child of Array.from(element.childNodes)) visit(child);
    }
    if (isBlock && !output.at(-1)?.endsWith("\n")) output.push("\n");
  };
  for (const child of Array.from(document.body.childNodes)) visit(child);
  return output
    .join("")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

async function htmlParts(
  html: string,
): Promise<{ body: string; title: string }> {
  const { DOMParser } = await import("linkedom/worker");
  const document = new DOMParser().parseFromString(html, "text/html");
  return {
    body: document.body.innerHTML,
    title:
      document.querySelector("title")?.textContent?.trim() ||
      "Converted document",
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
