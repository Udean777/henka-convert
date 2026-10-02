import { Document, HeadingLevel, Packer, Paragraph, TextRun } from "docx";

const headingLevels: Record<
  string,
  (typeof HeadingLevel)[keyof typeof HeadingLevel]
> = {
  H1: HeadingLevel.HEADING_1,
  H2: HeadingLevel.HEADING_2,
  H3: HeadingLevel.HEADING_3,
  H4: HeadingLevel.HEADING_4,
  H5: HeadingLevel.HEADING_5,
  H6: HeadingLevel.HEADING_6,
};

export async function htmlToDocx(html: string): Promise<Blob> {
  const paragraphs = await getParagraphs(html);
  const document = new Document({
    sections: [
      { children: paragraphs.length ? paragraphs : [new Paragraph("")] },
    ],
  });
  return Packer.toBlob(document);
}

async function getParagraphs(html: string): Promise<Paragraph[]> {
  const { DOMParser } = await import("linkedom/worker");
  const document = new DOMParser().parseFromString(html, "text/html");
  const output: Paragraph[] = [];
  const visit = (element: Element) => {
    const tag = element.tagName.toUpperCase();
    if (headingLevels[tag]) {
      addParagraph(element.textContent ?? "", { heading: headingLevels[tag] });
      return;
    }
    if (tag === "P" || tag === "PRE" || tag === "BLOCKQUOTE") {
      addParagraph(element.textContent ?? "", {
        ...(tag === "PRE" ? { font: "Consolas" } : {}),
        ...(tag === "BLOCKQUOTE" ? { italics: true } : {}),
      });
      return;
    }
    if (tag === "LI") {
      addParagraph(element.textContent ?? "", { bullet: { level: 0 } });
      return;
    }
    if (tag === "TR") {
      const cells = Array.from(element.children).map((cell) =>
        (cell.textContent ?? "").trim(),
      );
      addParagraph(cells.join("  |  "));
      return;
    }
    if (tag === "IMG") {
      const alt = element.getAttribute("alt")?.trim();
      if (alt) addParagraph(`[Image: ${alt}]`);
      return;
    }
    const children = Array.from(element.children);
    if (children.length > 0) {
      for (const child of children) visit(child);
      return;
    }
    addParagraph(element.textContent ?? "");
  };
  for (const element of Array.from(document.body.children)) visit(element);
  return output;

  function addParagraph(
    text: string,
    options: {
      heading?: (typeof HeadingLevel)[keyof typeof HeadingLevel];
      bullet?: { level: number };
      font?: string;
      italics?: boolean;
    } = {},
  ) {
    if (!text.trim()) return;
    output.push(
      new Paragraph({
        ...(options.heading ? { heading: options.heading } : {}),
        ...(options.bullet ? { bullet: options.bullet } : {}),
        children: [
          new TextRun({
            text,
            ...(options.font ? { font: options.font } : {}),
            ...(options.italics ? { italics: true } : {}),
          }),
        ],
      }),
    );
  }
}
