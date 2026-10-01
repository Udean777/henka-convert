import type { DocumentFormat } from "./types";

export async function toHtmlDocument(
  source: string,
  format: DocumentFormat,
): Promise<string> {
  if (format === "text/html") return sanitizeHtml(source);
  if (format === "text/plain") {
    return source
      .split(/\r?\n/)
      .map((line) => `<p>${escapeHtml(line) || "<br>"}</p>`)
      .join("");
  }
  if (format === "text/markdown") {
    const { marked } = await import("marked");
    return sanitizeHtml(await marked.parse(source));
  }
  throw new Error("DOCX content must be parsed by Mammoth");
}

export async function sanitizeHtml(source: string): Promise<string> {
  const { DOMParser } = await import("linkedom/worker");
  const document = new DOMParser().parseFromString(source, "text/html");
  const unsafeElements = document.querySelectorAll(
    "script,style,iframe,object,embed,form,input,button,link,meta,base,svg,video,audio,source",
  );
  for (const element of Array.from(unsafeElements as NodeListOf<Element>)) {
    element.remove();
  }

  for (const element of Array.from(
    document.querySelectorAll("*") as NodeListOf<Element>,
  )) {
    for (const attribute of Array.from(element.attributes as NamedNodeMap)) {
      const name = attribute.name.toLowerCase();
      const value = attribute.value.trim();
      if (
        name.startsWith("on") ||
        name === "srcdoc" ||
        name === "style" ||
        ((name === "href" || name === "src" || name === "xlink:href") &&
          isUnsafeUrl(value, element.tagName.toLowerCase(), name))
      ) {
        element.removeAttribute(attribute.name);
      }
    }
  }
  return document.body.innerHTML;
}

function isUnsafeUrl(value: string, tag: string, attribute: string): boolean {
  const protocol = /^[a-z][a-z0-9+.-]*:/i.exec(value)?.[0].toLowerCase();
  if (!protocol) return false;
  if (protocol === "http:" || protocol === "https:" || protocol === "mailto:") {
    return false;
  }
  return !(
    protocol === "data:" &&
    tag === "img" &&
    attribute === "src" &&
    /^data:image\/(png|jpeg|gif|webp);base64,/i.test(value)
  );
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
