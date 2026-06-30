import type { Cell } from "./cell";
import type { ColumnId, RowId } from "./common";

/** A single record. Cells are keyed by column id (FSD §3). */
export interface Row {
  id: RowId;
  cells: Record<ColumnId, Cell>;
}
