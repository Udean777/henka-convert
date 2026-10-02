import { MAX_DATA_WORKSHEET_CELLS } from "../shared/limits";
import { DataConversionError } from "./errors";
import { getWorkbookType } from "./formats";
import type { DataTable, WorkbookFormat } from "./types";

export async function getSpreadsheetWorksheetNames(
  source: ArrayBuffer,
): Promise<string[]> {
  try {
    const XLSX = await import("xlsx");
    const workbook = XLSX.read(source, { type: "array", bookSheets: true });
    return workbook.SheetNames;
  } catch {
    throw new DataConversionError("data-invalid-input");
  }
}

export async function parseSpreadsheetTable(
  source: ArrayBuffer,
  worksheetName: string | undefined,
): Promise<DataTable> {
  if (!worksheetName) {
    throw new DataConversionError("data-sheet-selection-required");
  }

  const XLSX = await import("xlsx");
  let workbook: ReturnType<typeof XLSX.read>;
  try {
    workbook = XLSX.read(source, { type: "array", cellDates: false });
  } catch {
    throw new DataConversionError("data-invalid-input");
  }
  const worksheet = workbook.Sheets[worksheetName];
  if (!worksheet) {
    throw new DataConversionError("data-sheet-unavailable");
  }

  const values = getWorksheetValues(XLSX, worksheet);
  return toDataTable(values);
}

export async function parseHtmlTable(source: string): Promise<DataTable> {
  const XLSX = await import("xlsx");
  let workbook: ReturnType<typeof XLSX.read>;
  try {
    workbook = XLSX.read(source, { type: "string" });
  } catch {
    throw new DataConversionError("data-invalid-input");
  }
  const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
  if (!firstSheet) throw new DataConversionError("data-invalid-input");
  return toDataTable(getWorksheetValues(XLSX, firstSheet));
}

export async function serializeSpreadsheetTable(
  table: DataTable,
  format: WorkbookFormat,
): Promise<Uint8Array> {
  const XLSX = await import("xlsx");
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet([table.headers, ...table.rows]);
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
  return XLSX.write(workbook, {
    bookType: getWorkbookType(format),
    type: "array",
    compression: true,
  });
}

export async function serializeHtmlTable(table: DataTable): Promise<string> {
  const XLSX = await import("xlsx");
  const worksheet = XLSX.utils.aoa_to_sheet([table.headers, ...table.rows]);
  return XLSX.utils.sheet_to_html(worksheet);
}

function getWorksheetValues(
  XLSX: typeof import("xlsx"),
  worksheet: import("xlsx").WorkSheet,
): unknown[][] {
  try {
    const range = worksheet["!ref"];
    if (!range) throw new DataConversionError("data-invalid-input");

    const bounds = XLSX.utils.decode_range(range);
    const cellCount =
      (bounds.e.r - bounds.s.r + 1) * (bounds.e.c - bounds.s.c + 1);
    if (cellCount > MAX_DATA_WORKSHEET_CELLS) {
      throw new DataConversionError("data-sheet-too-large");
    }
    return XLSX.utils.sheet_to_json<unknown[]>(worksheet, {
      header: 1,
      raw: false,
      defval: "",
      blankrows: false,
    });
  } catch (error) {
    if (error instanceof DataConversionError) throw error;
    throw new DataConversionError("data-invalid-input");
  }
}

function toDataTable(values: unknown[][]): DataTable {
  if (values.length === 0) throw new DataConversionError("data-invalid-input");
  const rows = values.map((row) => row.map(toDisplayedText));
  const headers = rows[0]?.map((header) => header.trim()) ?? [];
  if (
    headers.length === 0 ||
    headers.some((header) => header.length === 0) ||
    new Set(headers).size !== headers.length
  ) {
    throw new DataConversionError("data-invalid-headers");
  }
  return {
    headers,
    rows: rows
      .slice(1)
      .map((row) => headers.map((_, index) => row[index] ?? "")),
  };
}

function toDisplayedText(value: unknown): string {
  return value === null || value === undefined ? "" : String(value);
}
