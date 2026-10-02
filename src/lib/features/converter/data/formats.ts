import {
  HTML_TABLE_FORMAT,
  ODS_FORMAT,
  XLS_FORMAT,
  XLSX_FORMAT,
  type DataFormat,
  type WorkbookFormat,
} from "./types";

export const DATA_FORMAT_OPTIONS: { value: DataFormat; label: string }[] = [
  { value: "text/csv", label: "CSV" },
  { value: "text/tab-separated-values", label: "TSV" },
  { value: "application/json", label: "JSON" },
  { value: XLSX_FORMAT, label: "XLSX" },
  { value: XLS_FORMAT, label: "XLS" },
  { value: ODS_FORMAT, label: "ODS" },
  { value: HTML_TABLE_FORMAT, label: "HTML table" },
];

export const DATA_FORMATS = DATA_FORMAT_OPTIONS.map(({ value }) => value);

export function getDataFormatFromFilename(filename: string): DataFormat | null {
  const name = filename.toLowerCase();
  if (name.endsWith(".csv")) return "text/csv";
  if (name.endsWith(".tsv")) return "text/tab-separated-values";
  if (name.endsWith(".json")) return "application/json";
  if (name.endsWith(".xlsx")) return XLSX_FORMAT;
  if (name.endsWith(".xls")) return XLS_FORMAT;
  if (name.endsWith(".ods")) return ODS_FORMAT;
  if (name.endsWith(".html") || name.endsWith(".htm")) {
    return HTML_TABLE_FORMAT;
  }
  return null;
}

export function getDataExtension(format: DataFormat): string {
  if (format === "text/csv") return ".csv";
  if (format === "text/tab-separated-values") return ".tsv";
  if (format === "application/json") return ".json";
  if (format === XLSX_FORMAT) return ".xlsx";
  if (format === XLS_FORMAT) return ".xls";
  if (format === ODS_FORMAT) return ".ods";
  return ".html";
}

export function isWorkbookFormat(format: DataFormat): format is WorkbookFormat {
  return (
    format === XLSX_FORMAT || format === XLS_FORMAT || format === ODS_FORMAT
  );
}

export function getWorkbookType(
  format: WorkbookFormat,
): "xlsx" | "xls" | "ods" {
  if (format === XLSX_FORMAT) return "xlsx";
  if (format === XLS_FORMAT) return "xls";
  return "ods";
}
