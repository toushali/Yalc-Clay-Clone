"use client";

import { create } from "zustand";
import { dataService } from "@/lib/data";
import { emptyCell } from "@/lib/types";
import { SAMPLE_TABLE } from "@/lib/types/fixtures";
import { genId } from "@/lib/utils";
import type {
  CellValue,
  Column,
  ColumnId,
  RowId,
  StaticColumnType,
  Table,
  TableId,
  TableSummary,
  TableType,
  Workspace,
} from "@/lib/types";

const DEFAULT_COLUMN_NAME: Record<StaticColumnType, string> = {
  text: "Text",
  number: "Number",
  url: "URL",
  email: "Email",
};

const SEED_FLAG = "yalc:seeded";

/** Starter columns per table type (F1.4). */
function starterColumns(type: TableType): Column[] {
  if (type === "company") {
    return [
      { id: genId("col"), name: "Company", type: "text", width: 220 },
      { id: genId("col"), name: "Domain", type: "url", width: 200 },
    ];
  }
  if (type === "people") {
    return [
      { id: genId("col"), name: "Name", type: "text", width: 200 },
      { id: genId("col"), name: "Company Domain", type: "url", width: 200 },
    ];
  }
  return [{ id: genId("col"), name: "Name", type: "text", width: 220 }];
}

interface AppState {
  hydrated: boolean;
  workspace: Workspace | null;
  tables: TableSummary[];
  currentTable: Table | null;

  hydrate: () => Promise<void>;
  refreshTables: () => Promise<void>;
  loadTable: (id: TableId) => Promise<void>;
  createTable: (type: TableType, name?: string) => Promise<TableId>;
  renameTable: (id: TableId, name: string) => Promise<void>;
  duplicateTable: (id: TableId) => Promise<TableId | null>;
  deleteTable: (id: TableId) => Promise<void>;
  renameWorkspace: (name: string) => Promise<void>;

  // Grid mutations (operate on currentTable, persist through the data-service).
  updateCell: (rowId: RowId, columnId: ColumnId, value: CellValue) => Promise<void>;
  addRows: (count: number) => Promise<void>;
  deleteRows: (rowIds: RowId[]) => Promise<void>;
  addColumn: (type: StaticColumnType, name?: string) => Promise<void>;
  renameColumn: (columnId: ColumnId, name: string) => Promise<void>;
  deleteColumn: (columnId: ColumnId) => Promise<void>;
  moveColumn: (columnId: ColumnId, toIndex: number) => Promise<void>;
  resizeColumn: (columnId: ColumnId, width: number) => Promise<void>;
}

const defaultNameFor = (type: TableType) =>
  type === "company" ? "Companies" : type === "people" ? "People" : "Untitled Table";

export const useAppStore = create<AppState>((set, get) => ({
  hydrated: false,
  workspace: null,
  tables: [],
  currentTable: null,

  hydrate: async () => {
    if (get().hydrated) return;
    const workspace = await dataService.getWorkspace();
    let tables = await dataService.listTables();

    // First-run seed: one sample table so the workspace isn't empty. The flag
    // prevents re-seeding after the user deletes everything.
    const seeded =
      typeof window !== "undefined" && window.localStorage.getItem(SEED_FLAG);
    if (tables.length === 0 && !seeded) {
      const now = Date.now();
      await dataService.saveTable({ ...SAMPLE_TABLE, createdAt: now, updatedAt: now });
      if (typeof window !== "undefined")
        window.localStorage.setItem(SEED_FLAG, "1");
      tables = await dataService.listTables();
    }

    set({ workspace, tables, hydrated: true });
  },

  refreshTables: async () => {
    set({ tables: await dataService.listTables() });
  },

  loadTable: async (id) => {
    set({ currentTable: await dataService.getTable(id) });
  },

  createTable: async (type, name) => {
    const now = Date.now();
    const table: Table = {
      id: genId("tbl"),
      name: name?.trim() || defaultNameFor(type),
      type,
      columns: starterColumns(type),
      rows: [],
      createdAt: now,
      updatedAt: now,
    };
    await dataService.saveTable(table);
    if (typeof window !== "undefined") window.localStorage.setItem(SEED_FLAG, "1");
    await get().refreshTables();
    return table.id;
  },

  renameTable: async (id, name) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const table = await dataService.getTable(id);
    if (!table) return;
    table.name = trimmed;
    table.updatedAt = Date.now();
    await dataService.saveTable(table);
    await get().refreshTables();
    if (get().currentTable?.id === id) {
      set({ currentTable: { ...get().currentTable!, name: trimmed } });
    }
  },

  duplicateTable: async (id) => {
    const source = await dataService.getTable(id);
    if (!source) return null;
    const now = Date.now();
    const copy: Table = {
      ...source,
      id: genId("tbl"),
      name: `${source.name} copy`,
      createdAt: now,
      updatedAt: now,
    };
    await dataService.saveTable(copy);
    await get().refreshTables();
    return copy.id;
  },

  deleteTable: async (id) => {
    await dataService.deleteTable(id);
    if (get().currentTable?.id === id) set({ currentTable: null });
    await get().refreshTables();
  },

  updateCell: async (rowId, columnId, value) => {
    const t = get().currentTable;
    if (!t) return;
    const rows = t.rows.map((r) =>
      r.id === rowId
        ? {
            ...r,
            cells: {
              ...r.cells,
              [columnId]: {
                ...(r.cells[columnId] ?? emptyCell()),
                value,
                status: "success" as const,
                updatedAt: Date.now(),
              },
            },
          }
        : r,
    );
    const next = { ...t, rows, updatedAt: Date.now() };
    set({ currentTable: next });
    await dataService.saveTable(next);
  },

  addRows: async (count) => {
    const t = get().currentTable;
    if (!t || count < 1) return;
    const newRows = Array.from({ length: count }, () => ({
      id: genId("row"),
      cells: Object.fromEntries(t.columns.map((c) => [c.id, emptyCell()])),
    }));
    const next = { ...t, rows: [...t.rows, ...newRows], updatedAt: Date.now() };
    set({ currentTable: next });
    await dataService.saveTable(next);
    await get().refreshTables();
  },

  deleteRows: async (rowIds) => {
    const t = get().currentTable;
    if (!t || rowIds.length === 0) return;
    const remove = new Set(rowIds);
    const next = {
      ...t,
      rows: t.rows.filter((r) => !remove.has(r.id)),
      updatedAt: Date.now(),
    };
    set({ currentTable: next });
    await dataService.saveTable(next);
    await get().refreshTables();
  },

  addColumn: async (type, name) => {
    const t = get().currentTable;
    if (!t) return;
    const column: Column = {
      id: genId("col"),
      name: name?.trim() || DEFAULT_COLUMN_NAME[type],
      type,
      width: 180,
    };
    const rows = t.rows.map((r) => ({
      ...r,
      cells: { ...r.cells, [column.id]: emptyCell() },
    }));
    const next = {
      ...t,
      columns: [...t.columns, column],
      rows,
      updatedAt: Date.now(),
    };
    set({ currentTable: next });
    await dataService.saveTable(next);
    await get().refreshTables();
  },

  renameColumn: async (columnId, name) => {
    const t = get().currentTable;
    const trimmed = name.trim();
    if (!t || !trimmed) return;
    const columns = t.columns.map((c) =>
      c.id === columnId ? { ...c, name: trimmed } : c,
    );
    const next = { ...t, columns, updatedAt: Date.now() };
    set({ currentTable: next });
    await dataService.saveTable(next);
  },

  deleteColumn: async (columnId) => {
    const t = get().currentTable;
    if (!t) return;
    const columns = t.columns.filter((c) => c.id !== columnId);
    const rows = t.rows.map((r) => {
      const { [columnId]: _removed, ...rest } = r.cells;
      return { ...r, cells: rest };
    });
    const next = { ...t, columns, rows, updatedAt: Date.now() };
    set({ currentTable: next });
    await dataService.saveTable(next);
    await get().refreshTables();
  },

  moveColumn: async (columnId, toIndex) => {
    const t = get().currentTable;
    if (!t) return;
    const from = t.columns.findIndex((c) => c.id === columnId);
    if (from === -1) return;
    const clamped = Math.max(0, Math.min(t.columns.length - 1, toIndex));
    if (clamped === from) return;
    const columns = [...t.columns];
    const [moved] = columns.splice(from, 1);
    columns.splice(clamped, 0, moved);
    const next = { ...t, columns, updatedAt: Date.now() };
    set({ currentTable: next });
    await dataService.saveTable(next);
  },

  resizeColumn: async (columnId, width) => {
    const t = get().currentTable;
    if (!t) return;
    const columns = t.columns.map((c) =>
      c.id === columnId ? { ...c, width: Math.round(width) } : c,
    );
    const next = { ...t, columns, updatedAt: Date.now() };
    set({ currentTable: next });
    await dataService.saveTable(next);
  },

  renameWorkspace: async (name) => {
    const ws = get().workspace;
    if (!ws) return;
    const next = { ...ws, name: name.trim() || ws.name };
    await dataService.saveWorkspace(next);
    set({ workspace: next });
  },
}));
