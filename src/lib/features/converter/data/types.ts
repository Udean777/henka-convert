export type XlsxFormat =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
export type XlsFormat = "application/vnd.ms-excel";
export type OdsFormat = "application/vnd.oasis.opendocument.spreadsheet";
export type HtmlTableFormat = "text/html";
export const XLSX_FORMAT: XlsxFormat =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
export const XLS_FORMAT: XlsFormat = "application/vnd.ms-excel";
export const ODS_FORMAT: OdsFormat =
  "application/vnd.oasis.opendocument.spreadsheet";
export const HTML_TABLE_FORMAT: HtmlTableFormat = "text/html";
export type DelimitedDataFormat = "text/csv" | "text/tab-separated-values";
export type WorkbookFormat = XlsxFormat | XlsFormat | OdsFormat;
export type DataFormat =
  DelimitedDataFormat | "application/json" | WorkbookFormat | HtmlTableFormat;

export type DataConversionErrorCode =
  | "worker-unsupported"
  | "data-too-large"
  | "data-output-too-large"
  | "data-invalid-input"
  | "data-invalid-headers"
  | "data-json-structure-unsupported"
  | "data-sheet-selection-required"
  | "data-sheet-unavailable"
  | "data-sheet-too-large"
  | "data-conversion-failed";

export type DataCell = string | number | boolean | null;

export interface DataTable {
  headers: string[];
  rows: DataCell[][];
}
