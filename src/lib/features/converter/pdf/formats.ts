import { IMAGE_FORMAT_LABELS } from "../image/formats";
import { PDF_IMAGE_FORMATS, type PdfFormat } from "./types";

export const PDF_OUTPUT_FORMATS: { value: PdfFormat; label: string }[] = [
  ...PDF_IMAGE_FORMATS.map((value) => ({
    value,
    label: IMAGE_FORMAT_LABELS[value],
  })),
  { value: "text/plain", label: "Text" },
];
