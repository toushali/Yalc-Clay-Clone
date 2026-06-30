import type { ColumnId, RowId, RunId, TableId, Timestamp } from "./common";

/** What a run pass covers (F1.24): one cell, a whole column, or a whole table. */
export type RunScope =
  | { kind: "cell"; tableId: TableId; columnId: ColumnId; rowId: RowId }
  | { kind: "column"; tableId: TableId; columnId: ColumnId }
  | { kind: "table"; tableId: TableId };

export type RunStatus = "running" | "completed" | "cancelled" | "error";

/** An execution pass (FSD §3). Progress feeds the run panel (F1.25). */
export interface WorkflowRun {
  id: RunId;
  scope: RunScope;
  status: RunStatus;
  startedAt: Timestamp;
  finishedAt?: Timestamp;
  /** Cells finished (success | error | empty | skipped). */
  completed: number;
  total: number;
  creditsUsed: number;
}
