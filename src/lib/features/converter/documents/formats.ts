import type { DocumentFormat } from "./types";

export const DOCX_FORMAT =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document" as const;

export const DOCUMENT_FORMAT_OPTIONS: {
  value: DocumentFormat;
  label: string;
}[] = [
  { value: DOCX_FORMAT, label: "DOCX" },
  { value: "text/html", label: "HTML" },
  { value: "text/plain", label: "TXT" },
  { value: "text/markdown", label: "Markdown" },
];

export const DOCUMENT_FORMATS = DOCUMENT_FORMAT_OPTIONS.map(
  ({ value }) => value,
);

export function getDocumentFormatFromFilename(
  filename: string,
): DocumentFormat | null {
  const name = filename.toLowerCase();
  if (name.endsWith(".docx")) return DOCX_FORMAT;
  if (name.endsWith(".html") || name.endsWith(".htm")) return "text/html";
  if (name.endsWith(".txt")) return "text/plain";
  if (name.endsWith(".md") || name.endsWith(".markdown")) {
    return "text/markdown";
  }
  return null;
}

export function getDocumentExtension(format: DocumentFormat): string {
  switch (format) {
    case DOCX_FORMAT:
      return ".docx";
    case "text/html":
      return ".html";
    case "text/plain":
      return ".txt";
    case "text/markdown":
      return ".md";
  }
  const unreachable: never = format;
  return unreachable;
}
