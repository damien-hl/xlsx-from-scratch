import { createZip } from "./zip";
import type { FileEntry } from "./types";
import type { Workbook } from "../Workbook";
import { escapeXml } from "./helpers";

/**
 * Builds an XLSX file from a given workbook.
 * 
 * @param workbook - The workbook to convert to XLSX format.
 * 
 * @returns A Uint8Array representing the XLSX file.
 */
export function buildXlsx(
  workbook: Workbook
): Uint8Array {
  const worksheet = workbook.worksheets[0];
  const files: FileEntry[] = [];

  // 1. [Content_Types].xml
  files.push({
    path: "[Content_Types].xml",
    content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
  <Override PartName="/_rels/.rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Override PartName="/xl/_rels/workbook.xml.rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
</Types>`
  });

  // 2. _rels/.rels
  files.push({
    path: "_rels/.rels",
    content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`
  });

  // 3. xl/workbook.xml
  files.push({
    path: "xl/workbook.xml",
    content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets>
    <sheet name="Feuille1" sheetId="1" r:id="rId1"/>
  </sheets>
</workbook>`
  });

  // 4. xl/workbook.xml.rels
  files.push({
    path: "xl/_rels/workbook.xml.rels",
    content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
</Relationships>`
  });

  // 5. xl/worksheets/sheet1.xml
  files.push({
    path: "xl/worksheets/sheet1.xml",
    content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <sheetData>
    ${worksheet?.rows.map((row, r) => {
      return `<row r="${r + 1}">
        ${row.map((cell, c) => {
          const col = String.fromCharCode(65 + c);
          const type = typeof cell.value === "number" ? "" : ` t="inlineStr"`;
          const value = typeof cell.value === "number"
            ? `<v>${cell.value}</v>`
            : `<is><t>${escapeXml(String(cell.value))}</t></is>`;
          return `<c r="${col}${r + 1}"${type}>${value}</c>`;
        }).join("")}
      </row>`;
    }).join("\n")}
  </sheetData>
</worksheet>`
  });

  return createZip(files);
}
