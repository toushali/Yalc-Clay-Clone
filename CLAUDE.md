# CLAUDE.md — Build Conventions & Guardrails

This file tells AI/dev agents (and humans) **how** to build Yalc. Read this before writing code. The **what** lives in [`fsd.md`](./fsd.md); the **overview** in [`README.md`](./README.md).

---

## 0. Golden rules (do not violate)

1. **The UI never assumes real backends/APIs exist.** Every external capability (enrichment, AI research, write-back action, discovery search) is a **typed adapter** with a **mock implementation**. Real implementations plug in later without UI changes.
2. **Build to the FSD, in version order.** Do not pull V2/V3 features into V1. If a feature isn't in the current phase, stub it or omit it.
3. **The grid must be virtualized from day one.** Never render thousands of DOM rows. Use TanStack Virtual.
4. **Persist locally so refresh never loses work** (localStorage in V1, behind the data-service abstraction).
5. **Per-cell isolation:** one row/cell failing must never block others. Errors are per-cell with retry.
6. **Match Clay's product design language** (see §5). This is a dense productivity tool, not a marketing page — no decorative animation.
7. **One concern per file/component.** Keep components small and composable.

---

## 1. Tech stack & conventions

- **Next.js (App Router) + TypeScript** — strict mode on. No `any` unless justified with a comment.
- **Tailwind CSS** — use design tokens (§5), not arbitrary one-off values, where a token exists.
- **TanStack Table + TanStack Virtual** — grid engine.
- **Zustand** — client store (introduce when state outgrows local component state; V1 may start with Context).
- **Imports:** use the `@/` alias (`@/*` → `./src/*`). Confirm `tsconfig.json` paths.
- **Components:** function components + hooks. Prefer composition over props explosions.
- **Naming:** `PascalCase` components, `camelCase` functions/vars, `SCREAMING_SNAKE` consts, types in `@/lib/types`.
- **No business logic in components.** Put it in `@/lib` (adapters, store, data, utils).

---

## 2. The adapter pattern (most important architectural decision)

Every external/async capability implements a typed interface and has a **mock** version. This lets the whole frontend be built and demoed now, with real services swapped in later.

```ts
// @/lib/adapters/types.ts
export interface RunContext {
  rowId: string;
  inputs: Record<string, unknown>;   // resolved from referenced columns
  signal?: AbortSignal;
}

export interface RunResult<T = unknown> {
  status: "success" | "error" | "empty";
  value?: T;
  provenance?: string;               // which provider supplied it (waterfalls)
  creditsUsed: number;
  error?: string;
}

export interface Adapter<TConfig = unknown, TOut = unknown> {
  id: string;
  name: string;
  category: string;                  // "email" | "phone" | "company" | "ai" | "action" | ...
  costPerRun: number;
  run(config: TConfig, ctx: RunContext): Promise<RunResult<TOut>>;
}
```

- **Mock adapters** live in `@/lib/adapters/mock/`. They:
  - return **plausible, varied** fake data (not constant),
  - simulate **latency** (e.g. 400–1500ms, randomized),
  - occasionally return `empty` or `error` so status states are exercised,
  - decrement credits by `costPerRun`.
- **Enrichment, AI research, and actions are all adapters** — same interface, different categories.
- A **waterfall** is an ordered list of adapters run until one returns `success`; record `provenance`.

> When real services arrive, implement the same interface in `@/lib/adapters/real/` and switch the registry. **No component changes.**

---

## 3. Data layer & persistence

- All reads/writes go through a **data-service** module (`@/lib/data/`), never directly to localStorage from components.
- V1 implementation: in-memory state mirrored to localStorage (debounced).
- Keep the data-service interface backend-agnostic (e.g. `listTables()`, `saveTable()`, `upsertRows()`), so a real API can replace the localStorage impl.
- Object model types live in `@/lib/types` and match the FSD §3 (Workspace, Table, Column, Row, Cell, Provider, WorkflowRun).

---

## 4. Run engine

- A single **run orchestrator** executes a scope (cell / column / table).
- It resolves each cell's input columns, calls the relevant adapter, writes status transitions (`idle → running → success|error|empty|skipped`), and decrements credits.
- Runs are **cancellable** (AbortSignal) and **concurrent with a cap** (e.g. N rows in flight) to keep the UI responsive.
- Emit progress (completed/total, creditsUsed) for the run panel.
- **Conditions (V2):** if a column has a run condition that fails for a row, set the cell to `skipped` and consume 0 credits.

---

## 5. Design system (match app.clay.com)

**Aesthetic:** clean, dense, neutral productivity tool — Airtable × Notion × Linear. The grid and the data are the stars; chrome stays quiet.

### Tokens (Tailwind theme — define once, reuse)
```
Colors
  --bg            #ffffff      app canvas
  --bg-subtle     #fafafa      sidebar / panels
  --border        #ececec      cell + panel borders
  --border-strong #d9d9d9      header / dividers
  --text          #0a0a0a      primary
  --text-muted    #6b7280      secondary
  --text-faint    #9ca3af      tertiary / placeholders
  --accent        #4f46e5      single brand hue (buttons, active, links) — keep it sparing
  --accent-hover  #4338ca

Status (cells)
  idle     gray dot     #9ca3af
  running  pulsing      #4f46e5
  success  green        #16a34a / bg #f0fdf4
  error    red          #dc2626 / bg #fef2f2
  empty    muted        #9ca3af
  skipped  amber        #d97706 / bg #fffbeb

Radius:  sm 6px · md 8px · lg 12px
Shadow:  drawers/menus only; grid stays flat with borders
Font:    Inter (or system sans). Tabular nums in grid. Base 13–14px in grid, 14px UI.
Row height: ~36px. Header ~40px. Compact but clickable.
Motion: 150–250ms ease-out. Drawers slide-in. Running cells pulse. No decorative motion.
```

### Layout anatomy
- **Left sidebar** (~240px, collapsible): workspace name/switcher at top, table list (active item highlighted with subtle accent bg), "+ New table" button, settings at bottom.
- **Top bar** (~48px): editable table name (left), run controls + credit pill (right), avatar menu (far right).
- **Canvas:** the virtualized grid, edge to edge, sticky header + sticky first column.
- **Right config drawer** (~360px, slide-in): opens on column-header click; configure column type, input mapping, provider/prompt, run conditions. This drawer is core to the Clay feel — invest in it.
- **Cells:** 1px borders, hover highlight on row, selected cell ring in accent, status shown as a small dot/pill inline with the value.
- **Empty states:** friendly, instructive ("Add your first column" / "Import a CSV to get started").

### Component primitives to build first (`@/components/ui`)
Button, IconButton, Pill/Badge (incl. credit pill + status pill), Drawer, Modal, Dropdown/Menu, Tooltip, Input, Select, Checkbox, Spinner, Toast.

---

## 6. File/folder structure (target)

```
src/
├── app/
│   ├── (auth)/login/page.tsx
│   ├── app/layout.tsx                # shell: sidebar + topbar
│   ├── app/page.tsx                  # table list / last table
│   └── app/t/[tableId]/page.tsx      # a table
├── components/
│   ├── shell/                        # Sidebar, TopBar, AppLayout
│   ├── grid/                         # Grid, Row, Cell, HeaderCell, statuses
│   ├── columns/                      # ColumnConfigDrawer + per-type panels
│   ├── modals/                       # ProviderCatalog, ImportWizard, RunPanel...
│   └── ui/                           # primitives (§5)
├── lib/
│   ├── adapters/
│   │   ├── types.ts
│   │   ├── registry.ts               # id → adapter
│   │   └── mock/                     # mock providers, ai, actions
│   ├── data/                         # data-service + localStorage impl
│   ├── store/                        # zustand stores
│   ├── run/                          # run orchestrator
│   ├── types/                        # object model
│   └── utils/                        # cn(), csv, formatting
└── styles/
```

---

## 7. Quality bar

- **Performance:** smooth at 5,000+ rows. If a change risks the grid, virtualize or memoize.
- **Type safety:** model the domain in types; let the compiler catch mistakes. Avoid `any`.
- **Accessibility:** keyboard navigation in the grid (arrows, enter to edit, esc to cancel); focus rings; labels on controls; adequate contrast.
- **No dead code / no orphan files.** Remove what a refactor obsoletes.
- **Commits:** small, scoped, descriptive. One feature or fix per commit.

---

## 8. When unsure

- Prefer the **simplest thing that satisfies the current FSD phase**.
- If a decision affects architecture (state, data layer, adapter shape), keep it **swap-friendly** and note the assumption in a comment.
- Don't gold-plate V1 with V2/V3 concerns; leave clean seams instead.