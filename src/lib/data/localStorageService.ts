import type {
  Row,
  Table,
  TableId,
  TableSummary,
  Workspace,
} from "@/lib/types";
import type { DataService, PersistedState } from "./types";

const STORAGE_KEY = "yalc:state";
const SCHEMA_VERSION = 1;
const DEBOUNCE_MS = 400;

const hasWindow = () => typeof window !== "undefined";

/** Deep copy so callers can never mutate the service's internal state. */
const clone = <T>(v: T): T =>
  typeof structuredClone === "function"
    ? structuredClone(v)
    : (JSON.parse(JSON.stringify(v)) as T);

function createDefaultWorkspace(): Workspace {
  return {
    id: "ws_default",
    name: "My Workspace",
    members: [
      { id: "mbr_me", name: "You", email: "you@example.com", role: "admin" },
    ],
    creditBalance: 1000,
    createdAt: hasWindow() ? Date.now() : 0,
  };
}

const defaultState = (): PersistedState => ({
  version: SCHEMA_VERSION,
  workspace: createDefaultWorkspace(),
  tables: [],
});

const toSummary = (t: Table): TableSummary => ({
  id: t.id,
  name: t.name,
  type: t.type,
  rowCount: t.rows.length,
  updatedAt: t.updatedAt,
});

/**
 * localStorage-backed DataService. Reads come from an in-memory mirror hydrated
 * once; writes update the mirror and schedule a debounced flush. Corrupt or
 * version-mismatched storage degrades gracefully to an empty workspace.
 */
export class LocalStorageDataService implements DataService {
  private state: PersistedState | null = null;
  private flushTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    // Best-effort flush so a refresh during the debounce window loses nothing.
    if (hasWindow()) {
      window.addEventListener("pagehide", () => this.persistNow());
    }
  }

  private ensureHydrated(): PersistedState {
    if (this.state) return this.state;

    if (!hasWindow()) {
      this.state = defaultState();
      return this.state;
    }

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as PersistedState;
        if (parsed?.version === SCHEMA_VERSION && parsed.workspace) {
          this.state = parsed;
          return this.state;
        }
        // Unknown/old version — discard rather than risk a bad shape.
      }
    } catch {
      // Malformed JSON — fall through to a clean default.
    }

    this.state = defaultState();
    return this.state;
  }

  private scheduleFlush() {
    if (!hasWindow()) return;
    if (this.flushTimer) clearTimeout(this.flushTimer);
    this.flushTimer = setTimeout(() => this.persistNow(), DEBOUNCE_MS);
  }

  private persistNow() {
    if (!hasWindow() || !this.state) return;
    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch {
      // Quota or serialization failure — keep the in-memory mirror authoritative.
    }
  }

  // ── DataService ───────────────────────────────────────────────────────────

  async getWorkspace(): Promise<Workspace> {
    return clone(this.ensureHydrated().workspace);
  }

  async saveWorkspace(workspace: Workspace): Promise<void> {
    const state = this.ensureHydrated();
    state.workspace = clone(workspace);
    this.scheduleFlush();
  }

  async listTables(): Promise<TableSummary[]> {
    return this.ensureHydrated().tables.map(toSummary);
  }

  async getTable(id: TableId): Promise<Table | null> {
    const t = this.ensureHydrated().tables.find((x) => x.id === id);
    return t ? clone(t) : null;
  }

  async saveTable(table: Table): Promise<void> {
    const state = this.ensureHydrated();
    const next = clone(table);
    const idx = state.tables.findIndex((t) => t.id === table.id);
    if (idx === -1) state.tables.push(next);
    else state.tables[idx] = next;
    this.scheduleFlush();
  }

  async upsertRows(tableId: TableId, rows: Row[]): Promise<void> {
    const state = this.ensureHydrated();
    const table = state.tables.find((t) => t.id === tableId);
    if (!table) return;
    const byId = new Map(table.rows.map((r) => [r.id, r]));
    for (const row of rows) byId.set(row.id, clone(row));
    table.rows = [...byId.values()];
    table.updatedAt = hasWindow() ? Date.now() : table.updatedAt;
    this.scheduleFlush();
  }

  async deleteTable(id: TableId): Promise<void> {
    const state = this.ensureHydrated();
    state.tables = state.tables.filter((t) => t.id !== id);
    this.scheduleFlush();
  }

  async flush(): Promise<void> {
    this.persistNow();
  }
}
