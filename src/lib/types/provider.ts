import type { ProviderId } from "./common";

/** Catalog grouping in the provider modal (F1.16). */
export type ProviderCategory =
  | "email"
  | "phone"
  | "company"
  | "social"
  | "ai"
  | "action"
  | "signal";

/**
 * A (mock) data source (FSD §3). The adapter that executes it is resolved from
 * the registry by `id` (S9); this is the catalog-facing metadata.
 */
export interface Provider {
  id: ProviderId;
  name: string;
  category: ProviderCategory;
  costPerRun: number;
  /** Simulated latency window [minMs, maxMs] for the mock adapter. */
  mockLatency?: [number, number];
  /** Field keys this provider can return. */
  fields: string[];
  description?: string;
}
