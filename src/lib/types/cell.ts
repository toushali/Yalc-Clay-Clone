import type { CellStatus, ProviderId, Timestamp } from "./common";

/**
 * A cell value. Static columns hold scalars; AI `json` output and structured
 * enrichment results hold objects/arrays.
 */
export type CellValue =
  | string
  | number
  | boolean
  | null
  | Record<string, unknown>
  | unknown[];

/** Value at row × column (FSD §3). */
export interface Cell {
  value: CellValue;
  status: CellStatus;
  /** Which provider supplied the value (waterfalls record this). */
  provenance?: ProviderId;
  /** Human-readable error when `status === "error"`. */
  error?: string;
  /** Credits consumed producing this cell (0 for static/skipped). */
  creditsUsed?: number;
  updatedAt?: Timestamp;
}

/** An idle, empty cell — the default state for a freshly created row × column. */
export const emptyCell = (): Cell => ({ value: null, status: "idle" });
