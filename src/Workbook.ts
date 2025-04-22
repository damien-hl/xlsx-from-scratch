import { Worksheet } from "./Worksheet";

/**
 * Represents a workbook containing multiple worksheets.
 */
export class Workbook {
  worksheets: Worksheet[] = [];

  addWorksheet(name: string) {
    const ws = new Worksheet(name);
    this.worksheets.push(ws);
    return ws;
  }
}
