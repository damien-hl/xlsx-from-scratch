/**
 * Represents a cell in a spreadsheet.
 */
export class Cell {
  constructor(
    public value: string | number,
    public type?: "string" | "number"
  ) {}
}
