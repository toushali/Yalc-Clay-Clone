import type {
  Row,
  Table,
  TableId,
  TableSummary,
  Workspace,
} from "@/lib/types";

/**
 * The full persisted snapshot. Versioned so a schema change can migrate or
 * (worst case) discard cleanly rather than crash on stale data.
 */
export interface PersistedState {
  version: number;
  workspace: Workspace;
  tables: Table[];
}

/**
 * Backend-agnostic persistence boundary. Components never touch storage
 * directly — they go through this (CLAUDE.md §3). The V1 implementation mirrors
 * in-memory state to localStorage; a real API can implement the same interface
 * with no UI changes.
 *
 * All methods are async so the localStorage impl and a future network impl are
 * call-site identical.
 */
export interface DataService {
  getWorkspace(): Promise<Workspace>;
  saveWorkspace(workspace: Workspace): Promise<void>;

  /** Lightweight list for the sidebar (no row payloads). */
  listTables(): Promise<TableSummary[]>;
  getTable(id: TableId): Promise<Table | null>;
  saveTable(table: Table): Promise<void>;

  /** Merge rows into a table by id (update existing, append new). */
  upsertRows(tableId: TableId, rows: Row[]): Promise<void>;
  deleteTable(id: TableId): Promise<void>;

  /** Force any debounced write to flush now (tests, before unload). */
  flush(): Promise<void>;
}
