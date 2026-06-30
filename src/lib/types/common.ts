/**
 * Shared id + status vocabulary for the object model (FSD §3).
 * Ids are plain strings (named aliases for readability); a real backend can
 * swap these for branded/UUID types without touching call sites.
 */
export type WorkspaceId = string;
export type TableId = string;
export type ColumnId = string;
export type RowId = string;
export type ProviderId = string;
export type RunId = string;
export type MemberId = string;

/** Epoch milliseconds. */
export type Timestamp = number;

/**
 * Per-cell lifecycle. `skipped` is produced only by V2 run conditions but is
 * part of the vocabulary from day one so the status layer (S8) is complete.
 */
export type CellStatus =
  | "idle"
  | "running"
  | "success"
  | "error"
  | "empty"
  | "skipped";
