import { XlsxBuilder, Workbook, Cell } from "../src";

const wb = new Workbook();
const sheet = wb.addWorksheet("Sheet1");
sheet.addRow([
  new Cell("Hello"),
  new Cell("World"),
]);

const builder = new XlsxBuilder(wb);
const file = builder.build();

await Bun.write("generated/output.xlsx", file);
