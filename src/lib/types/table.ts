import type { Column } from "./column";
import type { Row } from "./row";
import type { TableId, Timestamp } from "./common";

/** Seed shape; drives default starter columns on creation (F1.4). */
export type TableType = "people" | "company" | "custom";

/** A spreadsheet of records (FSD §3). Column order is the array order. */
export interface Table {
  id: TableId;
  name: string;
  type: TableType;
  columns: Column[];
  rows: Row[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/** Lightweight table descriptor for the sidebar list (avoids loading rows). */
export interface TableSummary {
  id: TableId;
  name: string;
  type: TableType;
  rowCount: number;
  updatedAt: Timestamp;
}
