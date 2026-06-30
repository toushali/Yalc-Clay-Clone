"use client";

import { create } from "zustand";
import { dataService } from "@/lib/data";
import { SAMPLE_TABLE } from "@/lib/types/fixtures";
import { genId } from "@/lib/utils";
import type {
  Column,
  Table,
  TableId,
  TableSummary,
  TableType,
  Workspace,
} from "@/lib/types";

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

  renameWorkspace: async (name) => {
    const ws = get().workspace;
    if (!ws) return;
    const next = { ...ws, name: name.trim() || ws.name };
    await dataService.saveWorkspace(next);
    set({ workspace: next });
  },
}));
