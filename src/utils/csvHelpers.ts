import type { SkipTraceRecord } from "../types/SkipTrace";

export interface CSVRow {
  address: string;
  city: string;
  state: string;
  zipcode: string;
}

/**
 * Internal Helper: Escapes values for CSV compliance
 */
const formatCSVCell = (cell: string | number | null | undefined): string => {
  const stringValue = cell === null || cell === undefined ? "" : String(cell);
  return `"${stringValue.replace(/"/g, '""')}"`;
};

/**
 * DOWNLOAD TEMPLATE: Triggers a download for the user to fill out
 */
export const downloadCSVTemplate = () => {
  const csvContent =
    "address,city,state,zipcode\n123 Main St,Los Angeles,CA,90001\n456 Oak Ave,Miami,FL,33101";
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "property_template.csv");
  link.style.display = "none";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * VALIDATE DATA: Checks structure and content of uploaded CSV
 */
export const validateCSVData = (data: CSVRow[], headers: string[]) => {
  const MAX_ROWS = 400;
  const required = ["address", "city", "state", "zipcode"];

  const missingColumns = required.filter((col) => !headers.includes(col));
  if (missingColumns.length > 0) {
    return {
      isValid: false,
      error: `Missing required columns: ${missingColumns.join(", ")}`,
      data: [],
    };
  }

  if (data.length === 0) {
    return { isValid: false, error: "The CSV file is empty.", data: [] };
  }

  if (data.length > MAX_ROWS) {
    return {
      isValid: false,
      error: `The file exceeds the limit of ${MAX_ROWS} rows.`,
      data: [],
    };
  }

  const invalidRows = data.filter(
    (row) => !row.address || !row.city || !row.state || !row.zipcode,
  );

  if (invalidRows.length > 0) {
    return {
      isValid: false,
      error: `${invalidRows.length} rows have missing information.`,
      data: [],
    };
  }

  return { isValid: true, error: null, data };
};

/**
 * DOWNLOAD RESULTS: Generates the report after skip tracing is complete
 */
export const downloadResultsCSV = (
  records: SkipTraceRecord[],
  requestId: string,
  isUnlocked: boolean,
) => {
  if (!records.length) return;

  const rows: string[] = [];
  const executionDate = new Date().toLocaleDateString();
  const matchedCount = records.filter((r) => r.match).length;

  // --- BRANDING HEADER SECTION ---
  rows.push(formatCSVCell("PROPOMY"));
  rows.push(formatCSVCell("Platform URL: https://www.propomy.com"));
  rows.push(formatCSVCell(`Report Generated On: ${executionDate}`));
  rows.push(""); // Spacer block to isolate branding metadata

  // --- SECTION 1: BATCH SUMMARY ---
  rows.push(formatCSVCell("BATCH SUMMARY"));
  rows.push(
    ["Batch ID", "Date", "Total Records", "Matches Found"]
      .map(formatCSVCell)
      .join(","),
  );
  rows.push(
    [requestId, executionDate, records.length, matchedCount]
      .map(formatCSVCell)
      .join(","),
  );
  rows.push(""); // Spacer

  // --- SECTION 2: PROPERTY RESULTS ---
  rows.push(formatCSVCell("PROPERTY RESULTS"));
  const headers = [
    "Property Address",
    "Match Status",
    "Person Name",
    "Emails",
    "Phones",
    "Current Address",
    "Last Updated",
  ];

  rows.push(headers.map(formatCSVCell).join(","));

  records.forEach((rec) => {
    const inputAddr = rec.input?.address || "";

    if (!rec.match || !rec.output?.identity) {
      rows.push(
        [inputAddr, "No", "No Match", "", "", "", ""]
          .map(formatCSVCell)
          .join(","),
      );
      return;
    }

    const identity = rec.output.identity;
    (identity.names || []).forEach((person) => {
      const pId = person.personId;

      const emails = isUnlocked
        ? identity.emails
            ?.filter((e) => e.personId === pId)
            .map((e) => e.email)
            .join(", ")
        : "LOCKED";

      const phones = isUnlocked
        ? identity.phones
            ?.filter((p) => p.personId === pId)
            .map((p) => `${p.phoneDisplay || p.phone}`)
            .join(", ")
        : "LOCKED";

      rows.push(
        [
          inputAddr,
          "Yes",
          person.fullName || "N/A",
          emails || "",
          phones || "",
          identity.address?.formattedAddress || "",
          identity.address?.lastSeen || "",
        ]
          .map(formatCSVCell)
          .join(","),
      );
    });
  });

  const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `SkipTrace_Report_${requestId}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};