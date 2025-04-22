import type { Workbook } from "./Workbook";
import { buildXlsx } from "./internals/xlsx";

/**
 * Class to build an XLSX file from a workbook.
 * @example
 * ```ts
 * const wb = new Workbook();
 * const sheet = wb.addWorksheet("Sheet1");
 * sheet.addRow([
 *   new Cell("Hello"),
 *   new Cell("World"),
 * ]);
 *
 * const builder = new XlsxBuilder(wb);
 * const file = builder.build();
 *
 * await Bun.write("generated/output.xlsx", file);
 * ```
 */
export class XlsxBuilder {
  constructor(
    private workbook: Workbook
  ) {}

  build() {
    return buildXlsx(this.workbook);
  }
}
