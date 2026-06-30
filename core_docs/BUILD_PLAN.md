# Yalc — BUILD PLAN

Frontend-first, three versions matching the FSD (`core_docs/fsd.md`). Each session is one focused sitting with a concrete deliverable. Sessions are ordered; dependencies are explicit. Foundational work (S0–S4) is front-loaded so everything after is additive.

**Conventions:** "DoD" = definition of done. FSD IDs reference `core_docs/fsd.md §4`. Design tokens reference `CLAUDE.md §5`. We ship after V1 (S15), V2 (S26), and V3 (S35).

**Repo facts that shaped this plan:**
- `@/*` alias already set in `tsconfig.json` → `./src/*`. ✓
- Current `src/` is leftover marketing scaffold (`SmoothScrollProvider`, marketing `Button`/`Container`, deleted `sections/`/`designs/`/`DesignSwitcher`). `package.json` carries marketing deps (`framer-motion`, `lenis`) and is **missing** `@tanstack/react-table`, `@tanstack/react-virtual`, `zustand`. S0 resets this.
- Tailwind **v4** (`@tailwindcss/postcss`, no `tailwind.config.js`) → tokens go in `globals.css` via `@theme`, not a JS config. Next 16 / React 19.

---

## PHASE V1 — MVP: "The Enrichment Table"
**Phase goal:** Import a list → add an email-finder enrichment + an AI research column → run the table → watch cells fill with statuses → export. Everything persists locally.

### S0 — Project reset & design-token foundation
- **Goal:** Strip the marketing scaffold, install the real stack, lay down the design system in CSS so every later session uses tokens, not magic values.
- **Touches:** delete `src/components/providers/SmoothScrollProvider.tsx`, marketing `Button.tsx`/`Container.tsx`; rewrite `src/app/layout.tsx` (Inter font, base shell), `src/app/page.tsx` (temp redirect to `/app`), `src/app/globals.css` (`@theme` tokens from CLAUDE.md §5 — colors, status palette, radius, row heights, motion), `src/lib/utils.ts` (keep `cn()`); `package.json` (remove `framer-motion`/`lenis`; add `@tanstack/react-table`, `@tanstack/react-virtual`, `zustand`).
- **FSD:** design system foundation (CLAUDE.md §5; FSD §2).
- **Depends on:** none.
- **DoD:** `npm run dev` boots a clean white app at `/app` with Inter + token CSS vars resolving; no marketing code or deps remain; grid/store deps installed and importable.

### S1 — UI primitives (`@/components/ui`)
- **Goal:** Build the reusable primitives every screen needs, styled to tokens.
- **Touches:** `components/ui/` — `Button`, `IconButton`, `Pill` (incl. credit pill + status pill variants), `Drawer`, `Modal`, `Dropdown`/`Menu`, `Tooltip`, `Input`, `Select`, `Checkbox`, `Spinner`, `Toast` (+ a `ToastProvider`).
- **FSD:** CLAUDE.md §5 primitives.
- **Depends on:** S0.
- **DoD:** A throwaway `/app` preview renders each primitive in default/hover/disabled states; Drawer slides in/out (150–250ms), Modal traps focus, Toasts stack and auto-dismiss.

### S2 — Object model types (`@/lib/types`)
- **Goal:** Model the whole domain so the compiler guides the rest of the build.
- **Touches:** `lib/types/` — `Workspace`, `Table`, `Column` (+ `ColumnType` union: `text|number|url|email|enrichment|ai_research|formula|waterfall|action|signal`), `Row`, `Cell` (+ `CellStatus`: `idle|running|success|error|empty|skipped`), `Provider`, `WorkflowRun`, and config types per column type (discriminated-union seams; V2/V3 variants stubbed).
- **FSD:** FSD §3 object model.
- **Depends on:** S0.
- **DoD:** Types compile under `strict`; a sample fixture object typechecks; `skipped` status exists now (seam for V2) though unused.

### S3 — Data-service abstraction + localStorage persistence
- **Goal:** Backend-agnostic data layer; no component ever touches localStorage directly.
- **Touches:** `lib/data/` — `DataService` interface (`listTables`, `getTable`, `saveTable`, `upsertRows`, `deleteTable`, `getWorkspace`, `saveWorkspace`), `localStorageDataService.ts` impl (debounced writes, versioned key, safe JSON hydrate).
- **FSD:** F1.6, F1.31.
- **Depends on:** S2.
- **DoD:** Round-trip: save a table → reload → identical state restored; writes are debounced; corrupt/missing storage degrades gracefully to empty workspace.

### S4 — Store + app shell + routing + mock auth
- **Goal:** The persistent workspace shell and navigation everything renders inside.
- **Touches:** `lib/store/` (Zustand workspace store, hydrates from data-service, seeds one default workspace + 1,000 credits on first run); routes `app/(auth)/login/page.tsx` (mock login → localStorage session), `app/app/layout.tsx` (Sidebar + TopBar shell), `app/app/page.tsx` (last/empty table), `app/app/t/[tableId]/page.tsx`; `components/shell/` — `Sidebar` (~240px, collapsible, table list, "+ New table", Settings), `TopBar` (~48px, editable table name, run controls slot, credit-pill slot, avatar menu).
- **FSD:** F1.1, F1.2, F1.3.
- **Depends on:** S1, S3.
- **DoD:** Visiting `/app` unauthenticated redirects to mock login; logging in lands in the shell with sidebar + top bar; refresh keeps the session; default workspace persists.

### S5 — Table management
- **Goal:** Create/rename/duplicate/delete tables from the sidebar.
- **Touches:** `components/modals/NewTableModal.tsx` (People / Company / Blank), sidebar table-list interactions + context menu, store actions, route navigation on select.
- **FSD:** F1.4, F1.5, F1.6.
- **Depends on:** S4.
- **DoD:** Create each table type (seeded with type-appropriate starter columns), rename inline, duplicate (deep copy), delete (with confirm); list order + selection persist across reload.

### S6 — Virtualized grid core
- **Goal:** The hero — a virtualized grid that stays smooth at 5,000+ rows.
- **Touches:** `components/grid/` — `Grid` (TanStack Table + TanStack Virtual), `HeaderCell`, `Row`, `Cell` (read-only render), sticky header + sticky first column, horizontal/vertical scroll, ~36px rows / ~40px header, hover row highlight.
- **FSD:** F1.7, F1.12 (scroll/sticky portion).
- **Depends on:** S5.
- **DoD:** A 5,000-row fixture scrolls smoothly (only visible rows in DOM); header and first column stay pinned; columns render by type.

### S7 — Grid editing, rows & columns operations
- **Goal:** Make the grid interactive for static data.
- **Touches:** `components/grid/` editing (inline edit for `text|number|url|email`, enter-to-edit / esc-to-cancel, selected-cell accent ring), add-row / add-N-rows, add/rename/delete/reorder columns, column resize, row selection (single + shift/ctrl multi) + select-all checkbox.
- **FSD:** F1.8, F1.9, F1.10, F1.11, F1.12 (resize).
- **Depends on:** S6.
- **DoD:** Edit a cell and value persists via data-service; add/reorder/resize/delete columns; multi-select + select-all work; keyboard arrow navigation moves the selected cell.

### S8 — Cell status visuals
- **Goal:** The status vocabulary the run engine will drive.
- **Touches:** `components/grid/CellStatus.tsx` (dot/pill per `idle|running|success|error|empty|skipped` using §5 status tokens), running-pulse animation, provenance affordance (small caption/tooltip).
- **FSD:** F1.13.
- **Depends on:** S7.
- **DoD:** A fixture row showing every status renders correct color/animation; running cells pulse; `skipped` (amber) renders though not yet produced.

### S9 — Adapter interface + mock provider registry
- **Goal:** The architectural keystone — typed adapters with varied mocks.
- **Touches:** `lib/adapters/types.ts` (`Adapter`, `RunContext`, `RunResult` per CLAUDE.md §2), `lib/adapters/registry.ts` (id → adapter), `lib/adapters/mock/` — Work Email Finder, Phone Finder, Company Info, LinkedIn Profile Scraper, Email Verifier (varied fake data, randomized 400–1500ms latency, occasional `empty`/`error`, `costPerRun`).
- **FSD:** F1.18, F1.19.
- **Depends on:** S2.
- **DoD:** Each mock adapter, called directly, returns varied results with latency and the right credit cost; ~10% produce `empty`/`error`; registry resolves by id.

### S10 — Column config drawer + enrichment flow
- **Goal:** The right-side drawer that is "central to the Clay feel."
- **Touches:** `components/columns/ColumnConfigDrawer.tsx` (opens on header click; type, input mapping, provider/prompt section), per-type panels scaffold, `components/modals/ProviderCatalog.tsx` (grouped by Email/Phone/Company/Social), input-column mapping UI (`use {Company Domain}`).
- **FSD:** F1.16, F1.17.
- **Depends on:** S7, S9.
- **DoD:** Click a header → drawer slides in; convert a column to enrichment, pick a provider from the catalog, map an input column; config persists on the column.

### S11 — Run engine
- **Goal:** One orchestrator running cell / column / table with isolated, cancellable, concurrent runs.
- **Touches:** `lib/run/orchestrator.ts` (resolve inputs → call adapter → write status transitions → decrement credits; concurrency cap; `AbortSignal`; per-cell isolation; progress events), `components/modals/RunPanel.tsx` (completed/total, credits used), wire TopBar run controls, per-cell error + retry action.
- **FSD:** F1.24, F1.25, F1.26 (drives F1.13).
- **Depends on:** S8, S10.
- **DoD:** Run a single cell, a full column, and the whole table; statuses transition live; a failing row doesn't block others; cancel stops in-flight; retry re-runs one cell; run panel shows accurate progress.

### S12 — AI Research column ("Researcher")
- **Goal:** The mock AI column with a prompt editor and column variables.
- **Touches:** `lib/adapters/mock/aiResearch.ts`, `components/columns/AiPromptEditor.tsx` (NL prompt, `{Column Name}` variable chips with insertion, output mode: free text / single value / basic JSON), drawer panel for `ai_research`.
- **FSD:** F1.20, F1.21, F1.22, F1.23.
- **Depends on:** S11.
- **DoD:** Add an AI column, write a prompt referencing two columns via chips, run it → varied structured output per row in the chosen output mode; credits decrement.

### S13 — Credits system
- **Goal:** Visible, enforceable credit economy.
- **Touches:** `components/shell/CreditPill.tsx` (top bar, low-balance warning style), store credit balance + decrement wiring from run engine, `components/modals/LowCreditModal.tsx` (block runs at zero + mock "top up").
- **FSD:** F1.27, F1.28, F1.29.
- **Depends on:** S11.
- **DoD:** Runs decrement the pill in real time; pill warns when low; at zero, runs are blocked and the top-up modal restores balance; balance persists.

### S14 — CSV import / export + manual add-record
- **Goal:** Get data in and out.
- **Touches:** `components/modals/ImportWizard.tsx` (CSV upload → column mapping → create rows), `components/modals/AddRecordForm.tsx` (paste LinkedIn URL / domain → row), `lib/utils/csv.ts` (parse + serialize), export-to-CSV action in TopBar.
- **FSD:** F1.14, F1.15, F1.30.
- **Depends on:** S7.
- **DoD:** Import a sample CSV with column mapping → rows appear and persist; add a single record by URL/domain; export reproduces a valid CSV of current table state.

### S15 — Settings, polish & V1 ship pass 🚢
- **Goal:** Close V1 to a genuinely shippable MVP.
- **Touches:** `app/app/settings/page.tsx` (rename workspace, mock credit usage, sign out), empty states ("Add your first column" / "Import a CSV"), accessibility pass (grid keyboard nav, focus rings, control labels, contrast), end-to-end DoD walkthrough + fixes.
- **FSD:** F1.32; NFRs §7.
- **Depends on:** S12, S13, S14.
- **DoD:** The full V1 DoD loop runs cleanly end-to-end and survives reload; settings work; empty states guide a new user; no console errors; keyboard-navigable grid.

---

## PHASE V2 — "Automation & Intelligence"
**Phase goal:** Discover companies → waterfall-enrich → score → conditionally research → react to a signal → write back to a mock CRM, with views and a usage dashboard. Built on V1's adapter/run/data seams — additive, no UI rewrites.

### S16 — Waterfall enrichment
- **Goal:** Clay's signature feature: ordered providers, stop on first success, show provenance.
- **Touches:** `waterfall` column config (`components/columns/WaterfallBuilder.tsx` — drag-reorder steps, enable/disable), run engine sequential mode + provenance recording + "only pay for providers that ran" display.
- **FSD:** F2.1–F2.5.
- **Depends on:** S11 (run engine), S10 (drawer).
- **DoD:** A waterfall of 3 providers runs in order, stops on first success, records/shows provenance, charges only run steps; reordering changes execution order.

### S17 — Conditional run logic
- **Goal:** Per-column run conditions with a visual builder; skipped cells cost 0.
- **Touches:** `components/columns/ConditionBuilder.tsx` (field → operator → value, AND/OR groups), run engine condition evaluation → `skipped` state + 0 credits.
- **FSD:** F2.6–F2.8.
- **Depends on:** S11, S8 (skipped visual).
- **DoD:** Set "run only if {Email} is empty"; matching rows run, others show `skipped` and consume no credits.

### S18 — Formula columns
- **Goal:** Computed columns with a function library.
- **Touches:** `formula` column, `components/columns/FormulaEditor.tsx` (autocomplete of column refs + functions), `lib/formula/` (evaluator + library: `IF`, `CONCAT`, `DOMAIN_FROM_URL`, `NORMALIZE_NAME`, math/score helpers).
- **FSD:** F2.9–F2.11.
- **Depends on:** S7.
- **DoD:** A formula referencing two columns recomputes on input change; library functions evaluate correctly; bad formulas surface a clear error.

### S19 — Lead scoring & conditional formatting
- **Goal:** Weighted 0–100 score + color bands.
- **Touches:** `components/columns/LeadScoreBuilder.tsx` (weight fields), conditional-formatting rules on cells/rows by score band.
- **FSD:** F2.15, F2.16.
- **Depends on:** S18.
- **DoD:** Configure a weighted score → cells compute 0–100 and color by band; rows reflect band coloring.

### S20 — Signals & intent
- **Goal:** Monitoring column types + a signals feed.
- **Touches:** mock signal adapters (Job Change, Funding, Hiring, Tech Change, LinkedIn Activity), `components/views/SignalsFeed.tsx` (detected triggers + record + recommended action), active-signal flag + filter.
- **FSD:** F2.17–F2.19.
- **Depends on:** S11.
- **DoD:** Run a signal column → feed lists detected triggers with recommended actions; filtering by active signal works.

### S21 — Discovery / sources search
- **Goal:** Find new records from a mock dataset.
- **Touches:** `components/modals/DiscoveryPanel.tsx` (filter industry/size/location/title → import as rows), "find people at this company" expansion from a company row.
- **FSD:** F2.20, F2.21.
- **Depends on:** S5, S7.
- **DoD:** Search returns mock results, importable as rows; company expansion generates contact rows.

### S22 — Write-back actions (CRM / sequencer)
- **Goal:** Model the handoff with action column types.
- **Touches:** action adapters (Push to CRM, Add to Sequence, Send to Webhook), `components/columns/ActionConfig.tsx` (field mapping), per-row result/status + upsert/dedupe behavior.
- **FSD:** F2.22–F2.24.
- **Depends on:** S11.
- **DoD:** An action column maps fields and "pushes" rows to a mock destination with per-row success/upsert status.

### S23 — Filtering, sorting, saved views
- **Goal:** Filter/sort the grid and persist named views.
- **Touches:** `components/grid/FilterBar.tsx` (multi-condition), multi-column sort, `lib/store` views slice, saved-views menu, hide/show columns, group-by.
- **FSD:** F2.25–F2.27.
- **Depends on:** S7.
- **DoD:** Apply multi-filter + multi-sort; save/restore a named view (filters + sort + visible columns); group-by collapses correctly.

### S24 — Templates gallery
- **Goal:** Pre-built tables/workflows.
- **Touches:** `components/modals/TemplateGallery.tsx`, template definitions (Inbound enrichment, Find funded companies, CRM cleanup, ABM list), instantiate-into-new-table with mock data.
- **FSD:** F2.28, F2.29.
- **Depends on:** S16–S22 (templates compose those column types).
- **DoD:** Pick a template → a fully configured table with mock rows is created and runnable.

### S25 — Scheduling & auto-run
- **Goal:** Keep data fresh automatically (mock scheduler).
- **Touches:** `components/modals/ScheduleConfig.tsx` (daily/weekly), mock scheduler tick, "auto-run on new row" toggle wired to run engine.
- **FSD:** F2.30, F2.31.
- **Depends on:** S11.
- **DoD:** A scheduled column re-runs on the mock interval; adding a row with auto-run on triggers the configured columns.

### S26 — Usage analytics + pre-run cost, V2 ship pass 🚢
- **Goal:** Make spend visible and close V2.
- **Touches:** `app/app/usage/page.tsx` (credits by provider/table/over time — charts), pre-run cost estimate in RunPanel ("~340 credits"), V2 DoD walkthrough.
- **FSD:** F2.32, F2.33.
- **Depends on:** S16–S25.
- **DoD:** Dashboard reflects real run history; run panel shows an accurate pre-run estimate; the full V2 DoD scenario runs end-to-end.

---

## PHASE V3 — "Clay Parity: Collaboration, Governance & Advanced GTM"
**Phase goal:** A team collaborates on cross-table, branching workflows partly built by AI, using deployed agents and mock integrations, governed by roles/budgets/audit, with reporting. (Collaboration/presence are mocked/near-real-time — no real backend.)

### S27 — Roles & permissions
- **Goal:** Members + role-gated capabilities.
- **Touches:** `app/app/members/page.tsx`, roles (Admin/Builder/Viewer), permission-gating hooks across actions.
- **FSD:** F3.1.
- **Depends on:** S4.
- **DoD:** Switching role changes what the UI permits; viewer can't edit/run.

### S28 — Collaboration layer
- **Goal:** Presence, comments, sharing, activity log.
- **Touches:** mock presence, `components/collab/Comments.tsx` (cell/row comments, @mentions, resolve), share-link with role scope, per-table activity log.
- **FSD:** F3.2–F3.5.
- **Depends on:** S27.
- **DoD:** Comment threads with mentions resolve; presence indicators show; activity log records edits; share link applies role scope.

### S29 — AI workflow builder ("Sculptor")
- **Goal:** NL → table, inline AI assistant, workflow versioning.
- **Touches:** `components/ai/WorkflowGenerator.tsx` (describe goal → proposed columns/logic), inline assistant chat that mutates columns/formulas/prompts, version diff/rollback.
- **FSD:** F3.6–F3.8.
- **Depends on:** S18, S16.
- **DoD:** A described goal generates a configured table; assistant edits apply; versions diff and roll back.

### S30 — Agent studio
- **Goal:** Build/test/deploy/version reusable AI agents as column types.
- **Touches:** `app/app/agents/` (define name/system prompt/tools/output schema, test on sample rows, deploy as a column type, version).
- **FSD:** F3.9–F3.11.
- **Depends on:** S12.
- **DoD:** Define an agent, test on samples, deploy it as a usable column across tables; versioning works.

### S31 — Integrations marketplace
- **Goal:** Directory + mock connection flows + provider marketplace.
- **Touches:** `app/app/integrations/` (directory, OAuth-style mock connect/disconnect, health, field-schema discovery; provider marketplace with categories/search/cost + per-workspace enable).
- **FSD:** F3.12–F3.14.
- **Depends on:** S9.
- **DoD:** Connect/disconnect a mock integration with health state; enable/disable providers per workspace.

### S32 — Advanced orchestration
- **Goal:** Cross-table, branching, inbound webhooks, bulk ops.
- **Touches:** cross-table lookup/push column, branching builder (route rows by condition), inbound webhook trigger config + event log, bulk operations on filtered selections.
- **FSD:** F3.15–F3.18.
- **Depends on:** S16, S17, S23.
- **DoD:** A column reads/writes another table; rows branch by condition; a mock webhook creates rows and logs events; bulk re-run/action/delete work on a selection.

### S33 — Governance & security
- **Goal:** Budgets, retention/redaction, RBAC/SSO screens, audit export.
- **Touches:** `app/app/admin/` (credit budgets/alerts/caps per member/table, retention controls, field-level redaction, SSO placeholder + RBAC screens, workspace activity export).
- **FSD:** F3.19–F3.22.
- **Depends on:** S27, S26.
- **DoD:** A hard cap blocks runs over budget; redaction hides sensitive fields; audit export produces a complete log.

### S34 — Reporting & insights
- **Goal:** Coverage/performance analytics + shareable dashboards.
- **Touches:** `app/app/reports/` (match rates per provider, enrichment coverage %, signal volume; workflow success/error rates, credits per outcome; shareable dashboards).
- **FSD:** F3.23–F3.25.
- **Depends on:** S26.
- **DoD:** Reports compute from run history; a dashboard is shareable via link.

### S35 — QoL, polish & V3 ship pass 🚢
- **Goal:** The platform-feel finishers; close V3.
- **Touches:** command palette (⌘K), keyboard-first grid (copy/paste ranges, fill-down), undo/redo across edits, dark mode (token theme swap — §5 tokens authored for this), onboarding tour + empty-state guidance; V3 DoD walkthrough.
- **FSD:** F3.26–F3.30.
- **Depends on:** all prior V3.
- **DoD:** ⌘K navigates/acts; grid supports copy/paste/fill-down; undo/redo works; dark mode flips cleanly via tokens; onboarding tour runs; full V3 DoD scenario passes.

---

## Dependency spine (the load-bearing order)
`S0 tokens → S1 primitives → S2 types → S3 data-service → S4 shell/store → S5 tables → S6 grid → S7 grid editing → S8 statuses → S9 adapters → S10 config drawer → S11 run engine → (S12 AI, S13 credits, S14 CSV) → S15 ship V1`.

Everything in V2/V3 hangs off **S9 (adapters)**, **S11 (run engine)**, **S7 (grid)**, and **S3 (data-service)** — the four seams S0–S11 exist to create.

---

## Execution protocol
- One session at a time. After each session, the user confirms before the next begins.
- Each session ends by verifying its DoD against `npm run dev` / `npm run build` where applicable.
- Respect CLAUDE.md golden rules: adapters-with-mocks for every external capability, virtualization from day one, per-cell isolation, localStorage persistence, no V2/V3 features pulled into V1.

**▶ Start here: S0 — Project reset & design-token foundation.**
