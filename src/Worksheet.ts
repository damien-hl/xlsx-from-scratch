import type { Cell } from "./Cell";

/**
 * Represents a worksheet in a spreadsheet.
 */
export class Worksheet {
  rows: Cell[][] = [];

  constructor(
    public name: string
  ) {}

  addRow(row: Cell[]) {
    this.rows.push(row);
  }
}
