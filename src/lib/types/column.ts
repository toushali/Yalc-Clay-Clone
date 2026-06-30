import type { ColumnId, ProviderId } from "./common";

/**
 * Every column kind. Static kinds (`text`/`number`/`url`/`email`) are editable
 * in the grid; the rest are computed by an adapter or the run engine.
 *   V1: text, number, url, email, enrichment, ai_research
 *   V2: formula, waterfall, action, signal
 */
export type ColumnType =
  | "text"
  | "number"
  | "url"
  | "email"
  | "enrichment"
  | "ai_research"
  | "formula"
  | "waterfall"
  | "action"
  | "signal";

/** Kinds the user can type into directly. */
export const STATIC_COLUMN_TYPES = ["text", "number", "url", "email"] as const;
export type StaticColumnType = (typeof STATIC_COLUMN_TYPES)[number];

export const isStaticColumnType = (t: ColumnType): t is StaticColumnType =>
  (STATIC_COLUMN_TYPES as readonly string[]).includes(t);

// ── Per-type config ────────────────────────────────────────────────────────

/** Static columns carry no behavior; reserved for future display options. */
export interface StaticColumnConfig {
  format?: string;
}

/** Single-provider enrichment (F1.16–F1.18). */
export interface EnrichmentConfig {
  providerId: ProviderId | null;
  /** Provider input key → source column id (e.g. `{ domain: "col_company" }`). */
  inputMapping: Record<string, ColumnId>;
}

export type AiOutputMode = "text" | "single_value" | "json";

/** AI Research column (F1.20–F1.23). */
export interface AiResearchConfig {
  /** NL prompt with `{Column Name}` variable references. */
  prompt: string;
  outputMode: AiOutputMode;
}

// ── V2/V3 config seams (typed now, built later) ─────────────────────────────

/** Ordered provider chain; stop on first success (F2.1–F2.5). Built in S16. */
export interface WaterfallConfig {
  steps: { providerId: ProviderId; enabled: boolean; inputMapping: Record<string, ColumnId> }[];
}

/** Formula column (F2.9–F2.11). Built in S18. */
export interface FormulaConfig {
  expression: string;
}

/** Write-back action (F2.22–F2.24). Built in S22. */
export interface ActionConfig {
  destination: string | null;
  fieldMapping: Record<string, ColumnId>;
}

/** Signal/intent monitor (F2.17–F2.19). Built in S20. */
export interface SignalConfig {
  signalType: string | null;
  inputMapping: Record<string, ColumnId>;
}

/**
 * Per-column run condition (F2.6–F2.8). Built in S17; present here so the run
 * engine's `skipped` path has a typed shape to grow into.
 */
export interface RunCondition {
  field: ColumnId;
  operator: "is_empty" | "is_not_empty" | "eq" | "neq" | "gt" | "lt" | "contains";
  value?: string | number;
}

// ── Column union ────────────────────────────────────────────────────────────

interface ColumnBase {
  id: ColumnId;
  name: string;
  /** Rendered width in px; the grid manages this. */
  width?: number;
  /** V2 seam: gate execution per row. */
  runCondition?: RunCondition;
}

export type Column =
  | (ColumnBase & { type: StaticColumnType; config?: StaticColumnConfig })
  | (ColumnBase & { type: "enrichment"; config: EnrichmentConfig })
  | (ColumnBase & { type: "ai_research"; config: AiResearchConfig })
  | (ColumnBase & { type: "waterfall"; config: WaterfallConfig })
  | (ColumnBase & { type: "formula"; config: FormulaConfig })
  | (ColumnBase & { type: "action"; config: ActionConfig })
  | (ColumnBase & { type: "signal"; config: SignalConfig });

/** Columns whose cells are produced by an adapter / the run engine. */
export const isRunnableColumn = (
  c: Column,
): c is Extract<Column, { type: "enrichment" | "ai_research" | "waterfall" | "action" | "signal" }> =>
  c.type === "enrichment" ||
  c.type === "ai_research" ||
  c.type === "waterfall" ||
  c.type === "action" ||
  c.type === "signal";
