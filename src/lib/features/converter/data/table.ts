import Papa from "papaparse";
import { DataConversionError } from "./errors";
import { isWorkbookFormat } from "./formats";
import {
  parseHtmlTable,
  parseSpreadsheetTable,
  serializeHtmlTable,
  serializeSpreadsheetTable,
} from "./spreadsheet";
import type {
  DataCell,
  DataFormat,
  DataTable,
  DelimitedDataFormat,
} from "./types";

export async function convertTable(
  sourceFormat: DataFormat,
  targetFormat: DataFormat,
  sourceData: string | ArrayBuffer,
  worksheetName?: string,
): Promise<string | Uint8Array> {
  const table = isWorkbookFormat(sourceFormat)
    ? await parseSpreadsheetTable(toArrayBuffer(sourceData), worksheetName)
    : sourceFormat === "text/html"
      ? await parseHtmlTable(toText(sourceData))
      : sourceFormat === "application/json"
        ? parseJsonTable(toText(sourceData))
        : parseDelimitedTable(sourceFormat, toText(sourceData));

  if (isWorkbookFormat(targetFormat)) {
    return serializeSpreadsheetTable(table, targetFormat);
  }
  if (targetFormat === "text/html") {
    return serializeHtmlTable(table);
  }
  if (targetFormat === "application/json") {
    return serializeJsonTable(table);
  }
  return serializeDelimitedTable(targetFormat, table);
}

function toText(data: string | ArrayBuffer): string {
  if (typeof data !== "string") {
    throw new DataConversionError("data-invalid-input");
  }
  return data;
}

function toArrayBuffer(data: string | ArrayBuffer): ArrayBuffer {
  if (typeof data === "string") {
    throw new DataConversionError("data-invalid-input");
  }
  return data;
}

function parseDelimitedTable(
  format: DelimitedDataFormat,
  sourceText: string,
): DataTable {
  const result = Papa.parse<string[]>(sourceText, {
    delimiter: format === "text/tab-separated-values" ? "\t" : "",
    dynamicTyping: false,
    skipEmptyLines: "greedy",
  });

  if (result.errors.length > 0 || result.data.length === 0) {
    throw new DataConversionError("data-invalid-input");
  }

  const headers = result.data[0]?.map((header) => header.trim()) ?? [];
  if (
    headers.length === 0 ||
    headers.some((header) => header.length === 0) ||
    new Set(headers).size !== headers.length
  ) {
    throw new DataConversionError("data-invalid-headers");
  }

  const rows = result.data.slice(1).map((row) => {
    if (row.length > headers.length) {
      throw new DataConversionError("data-invalid-input");
    }
    return headers.map((_, index) => row[index] ?? "");
  });

  return { headers, rows };
}

function parseJsonTable(sourceText: string): DataTable {
  let value: unknown;
  try {
    value = JSON.parse(sourceText);
  } catch {
    throw new DataConversionError("data-invalid-input");
  }

  if (!Array.isArray(value)) {
    throw new DataConversionError("data-json-structure-unsupported");
  }

  const records = value as unknown[];
  if (!records.every(isFlatRecord)) {
    throw new DataConversionError("data-json-structure-unsupported");
  }

  const headers = [
    ...new Set(records.flatMap((record) => Object.keys(record))),
  ];
  if (records.length > 0 && headers.length === 0) {
    throw new DataConversionError("data-json-structure-unsupported");
  }

  return {
    headers,
    rows: records.map((record) =>
      headers.map((header) => record[header] ?? null),
    ),
  };
}

function isFlatRecord(value: unknown): value is Record<string, DataCell> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  return Object.values(value).every(
    (cell) =>
      cell === null ||
      typeof cell === "string" ||
      typeof cell === "number" ||
      typeof cell === "boolean",
  );
}

function serializeJsonTable(table: DataTable): string {
  const records = table.rows.map((row) =>
    Object.fromEntries(
      table.headers.map((header, index) => [header, row[index]]),
    ),
  );
  return JSON.stringify(records, null, 2);
}

function serializeDelimitedTable(
  format: DelimitedDataFormat,
  table: DataTable,
): string {
  return Papa.unparse(
    { fields: table.headers, data: table.rows },
    {
      delimiter: format === "text/tab-separated-values" ? "\t" : ",",
      newline: "\r\n",
    },
  );
}
