# Functional Specification Document (FSD)
## Yalc — A Clay Clone (GTM Data Enrichment & Workflow Workspace)

**Document type:** Functional Specification
**Scope:** Product application frontend (the post-login workspace — `app.clay.com` equivalent), NOT the marketing landing page.
**Status:** Draft v1
**Build approach:** Frontend-first, delivered in 3 progressive versions (V1 → V2 → V3).

---

## 1. Product Summary

### 1.1 What this product is
Yalc is a **programmable, spreadsheet-style workspace** for go-to-market (GTM) teams. At its core it is a smart table where:
- Each **row** is a record (a person or a company).
- Each **column** is either static data, an **enrichment** (pull data from a provider), an **AI research step**, a **formula**, or a **write-back action** (push to CRM / sequencer).
- Columns run **top-to-bottom per row**, and a table runs **left-to-right per column**, forming a workflow.

The defining concepts (mirroring Clay):
1. **Waterfall enrichment** — query multiple data providers in sequence until a value is found, so you only "pay" when a provider returns a match.
2. **AI research agent ("Researcher" / Claygent equivalent)** — a column type that runs natural-language web research on each row and returns structured output.
3. **Signals & intent** — monitor records for triggers (job changes, funding, hiring, tech changes) to time outreach.
4. **Credit system** — every enrichment / AI action consumes credits; usage must be visible and controllable.
5. **Integrations** — import sources (CSV, CRM, search) and write-back destinations (CRM, sequencers).

### 1.2 Who uses it
- **GTM Engineer / RevOps (primary builder):** builds tables, configures waterfalls, writes AI prompts, sets conditional logic.
- **Sales / SDR (consumer):** views enriched lists, runs saved workflows, exports.
- **Admin:** manages workspace, members, credits, billing, integrations.

### 1.3 Out of scope (for all versions)
- Real third-party data provider contracts (we **simulate** providers with mock data + latency).
- Real email sending / sequencing engine (we model the **handoff**, not the SMTP layer).
- Real billing/payment processing (credits are tracked and displayed; top-up is mocked).
- Mobile-native apps (responsive web only; desktop-first).

---

## 2. Tech & Architecture Assumptions (frontend)

- **Framework:** Next.js (App Router) + TypeScript.
- **Styling:** Tailwind CSS.
- **State:** Local component state for V1; a client store (Zustand or React Context) for V2+ as tables grow.
- **Data layer:** V1 = in-memory mock + localStorage persistence. V2+ = abstracted data-service layer so a real backend (FastAPI/Supabase/Postgres) can be swapped in without UI changes.
- **Table engine:** virtualized grid (e.g. TanStack Table + TanStack Virtual) so thousands of rows stay performant.
- **Enrichment/AI calls:** mocked async functions with artificial latency and deterministic-but-varied fake results in V1; pluggable adapters in V2+.

> Design principle: **the UI must not assume real APIs exist.** Every enrichment/AI/action is an adapter with a typed interface (`run(input) => Promise<Result>`). Mock adapters in V1, real adapters later.

---

## 3. Core Object Model (shared across versions)

| Object | Description | Key fields |
|---|---|---|
| **Workspace** | Top-level tenant container | id, name, members, creditBalance |
| **Table** | A spreadsheet of records | id, name, type (people/company/custom), columns[], rows[] |
| **Column** | A field/step in a table | id, name, type, config, status |
| **Row** | A single record | id, cells{} (keyed by columnId), status |
| **Cell** | Value at row×column | value, status (idle/running/success/error/empty), provenance (which provider returned it) |
| **Column types** | | `text`, `number`, `url`, `email`, `enrichment`, `ai_research`, `formula`, `lookup/waterfall`, `action/write-back`, `signal` |
| **Provider** | A (mock) data source | id, name, category, costPerRun, mockLatency, fields it returns |
| **Workflow run** | An execution pass | id, scope (row/column/table), startedAt, status, creditsUsed |

---

## 4. Versioned Feature Breakdown

The product is delivered in three versions. **V1 is a usable MVP**; V2 adds the automation/intelligence layer; V3 reaches Clay-parity with collaboration, governance, and advanced GTM tooling.

---

## VERSION 1 — MVP: "The Enrichment Table"
**Goal:** A user can create a table, add records, add enrichment + AI columns, run them, see results fill in, and export. This proves the core loop.

### 4.1 Authentication & Workspace shell
- **F1.1** Mock login / signup screen (email + password fields, no real auth backend required — a fake session in localStorage is fine).
- **F1.2** Single default workspace created on first login.
- **F1.3** App shell layout:
  - Left **sidebar**: workspace name, list of tables, "+ New table", "Settings" link.
  - Top **bar**: table name (editable), credit balance pill, "Run" controls, user avatar menu.
  - Main **canvas**: the table grid.

### 4.2 Tables
- **F1.4** Create a new table (choose: People table / Company table / Blank).
- **F1.5** Rename, duplicate, delete a table.
- **F1.6** Table list persists across reloads (localStorage).

### 4.3 The Grid (spreadsheet core)
- **F1.7** Render a virtualized grid of rows × columns.
- **F1.8** Add row manually; add multiple empty rows.
- **F1.9** Add/rename/delete/reorder columns.
- **F1.10** Inline cell editing for static column types (text, number, url, email).
- **F1.11** Row selection (single + multi via checkbox); select-all.
- **F1.12** Column resize; horizontal + vertical scroll; sticky header + sticky first column.
- **F1.13** Cell status visual states: idle, running (spinner), success, error, empty.

### 4.4 Data import
- **F1.14** Import via **CSV upload** → map CSV columns to table columns → create rows.
- **F1.15** Manual "add record" form (paste a LinkedIn URL or domain → creates a row).

### 4.5 Enrichment columns (mocked providers)
- **F1.16** "Add enrichment" flow: pick a provider from a **provider catalog modal** (grouped by category: Email, Phone, Company data, Social).
- **F1.17** Configure the enrichment: map which input column feeds it (e.g. "use {Company Domain}").
- **F1.18** Each provider is a **mock adapter** returning plausible fake data after a simulated delay, with a per-run credit cost.
- **F1.19** Provider catalog for V1 (mock): Work Email Finder, Phone Finder, Company Info (size, industry, HQ), LinkedIn Profile Scraper, Email Verifier.

### 4.6 AI Research column (the "Researcher")
- **F1.20** Add an "AI Research" column.
- **F1.21** Natural-language prompt editor with **variable insertion** (reference other columns via `{Column Name}` chips).
- **F1.22** On run, a mock AI adapter returns structured text per row (later swappable for a real LLM call).
- **F1.23** Output can be set to return: free text, or a single value, or JSON (basic).

### 4.7 Running workflows
- **F1.24** Run a **single cell**, a **whole column** (all rows), or the **whole table**.
- **F1.25** Progress indicator: rows completed / total, credits consumed this run.
- **F1.26** Per-cell error display with a "retry" action.

### 4.8 Credits
- **F1.27** Workspace starts with a fixed mock credit balance (e.g. 1,000).
- **F1.28** Each enrichment/AI run decrements credits by its cost.
- **F1.29** Credit balance pill in the top bar; warns when low; blocks runs at zero (with a mock "top up" button).

### 4.9 Export & persistence
- **F1.30** Export table to CSV.
- **F1.31** Auto-save table state to localStorage; restore on reload.

### 4.10 Settings (minimal)
- **F1.32** Workspace settings page: rename workspace, view (mock) credit usage, sign out.

**V1 Definition of Done:** Import a list → add an email-finder enrichment + an AI research column → run the table → watch cells fill with statuses → export the result. Everything persists locally.

---

## VERSION 2 — "Automation & Intelligence"
**Goal:** Move from a manual table to an automated workflow engine: waterfalls, conditional logic, signals, templates, and CRM write-back. This is where it starts to feel like real Clay.

### 4.11 Waterfall enrichment (the signature feature)
- **F2.1** A **waterfall column** that chains multiple providers in a user-defined order.
- **F2.2** Sequential execution: try Provider A; if no result, try B; then C — stop on first success.
- **F2.3** Per-step config and visible **provenance** (which provider supplied the value).
- **F2.4** Credit optimization display: "you only pay for the providers that ran."
- **F2.5** Drag-to-reorder the provider sequence; enable/disable steps.

### 4.12 Conditional logic / run conditions
- **F2.6** Per-column **run condition** ("only run this column if {ICP Score} > 70" / "if {Email} is empty").
- **F2.7** Visual condition builder (field → operator → value), with AND/OR groups.
- **F2.8** Rows skipped by a condition show a distinct "skipped" cell state.

### 4.13 Formula columns
- **F2.9** A formula column type with a function library (text manipulation, conditionals, math, lookups across columns).
- **F2.10** Formula editor with autocomplete of column references and functions.
- **F2.11** Common helpers: `IF`, `CONCAT`, `DOMAIN_FROM_URL`, `NORMALIZE_NAME`, score calculators.

### 4.14 Scoring / ICP qualification
- **F2.15** A guided "Lead Score" column: weight several fields into a 0–100 score.
- **F2.16** Conditional formatting (color cells/rows by score band).

### 4.15 Signals & intent (monitoring)
- **F2.17** Signal column types (mock): Job Change, New Funding Round, Hiring (open roles), Tech Stack Change, LinkedIn Activity.
- **F2.18** A **Signals view**: a feed of detected triggers across a table, with the affected record + recommended action.
- **F2.19** Mark a row as "active signal" and filter the table by it.

### 4.16 Sources / discovery (find new records)
- **F2.20** "Find people/companies" search panel (mock dataset): filter by industry, size, location, title → import results as rows.
- **F2.21** "Find people at this company" expansion (given a company row, generate contact rows).

### 4.17 Write-back actions (CRM / sequencer handoff)
- **F2.22** Action column types (mock): "Push to CRM" (create/update contact or company), "Add to Sequence", "Send to Webhook".
- **F2.23** Field mapping UI (table column → destination field).
- **F2.24** Action result + status per row; dedupe/upsert behavior (update if exists, create if not).

### 4.18 Filtering, sorting, views
- **F2.25** Filter bar (multi-condition) and multi-column sort.
- **F2.26** Saved **views** (named filter+sort+visible-column configurations).
- **F2.27** Hide/show columns; group by a column.

### 4.19 Templates
- **F2.28** Template gallery: pre-built tables/workflows (e.g. "Inbound lead enrichment", "Find funded companies", "CRM cleanup", "ABM account list").
- **F2.29** Instantiate a template into a new table with mock data.

### 4.20 Scheduling & auto-update
- **F2.30** Schedule a table/column to re-run on an interval (mock scheduler: daily/weekly) to keep data fresh.
- **F2.31** "Auto-run on new row" toggle (when a row is added, run the configured columns).

### 4.21 Credit & usage analytics
- **F2.32** Usage dashboard: credits by provider, by table, over time (charts).
- **F2.33** Per-run cost estimate **before** running ("this run will cost ~340 credits").

**V2 Definition of Done:** Build a table that discovers companies → waterfall-enriches contacts → scores them → only researches high-fit rows → reacts to a funding signal → pushes qualified contacts to a mock CRM, with saved views and a usage dashboard.

---

## VERSION 3 — "Clay Parity: Collaboration, Governance & Advanced GTM"
**Goal:** Everything that makes Clay an enterprise platform: multi-user collaboration, an AI workflow builder, an agent studio, governance, an integrations marketplace, and advanced orchestration.

### 4.22 Multi-user collaboration
- **F3.1** Workspace members & roles (Admin, Builder, Viewer) with permission gating.
- **F3.2** Real-time presence (who's viewing a table), shared cursors/selection (or near-real-time).
- **F3.3** Comments on cells/rows; @mentions; comment resolution.
- **F3.4** Share a table/view via link with role-scoped access.
- **F3.5** Activity log / audit trail per table.

### 4.23 AI Workflow Builder ("Sculptor" equivalent)
- **F3.6** Natural-language table/workflow generation: describe a goal → AI proposes columns, enrichments, and logic.
- **F3.7** Inline AI assistant that can add/modify columns, write formulas, and tune prompts via chat.
- **F3.8** Versioning of AI-generated workflows (track, diff, roll back).

### 4.24 Agent Studio (build & deploy reusable AI agents)
- **F3.9** Define a reusable research agent (name, system prompt, tools/data it can use, output schema).
- **F3.10** Test an agent on sample rows before deploying.
- **F3.11** Deploy an agent as a column type usable across tables; version it.

### 4.25 Integrations marketplace
- **F3.12** Integrations directory UI (connect CRM, sequencers, warehouses, Slack, webhooks) with connect/disconnect state.
- **F3.13** OAuth-style connection flow (mock), connection health, and field-schema discovery.
- **F3.14** Provider marketplace with categories, search, "cost per run," and enable/disable per workspace.

### 4.26 Advanced orchestration
- **F3.15** Cross-table workflows: a column that looks up / pushes into another table.
- **F3.16** Branching workflows (route rows to different downstream actions by condition).
- **F3.17** Webhook triggers (inbound): create/update rows when an external event fires (mock endpoint + log).
- **F3.18** Bulk operations on filtered selections (bulk re-run, bulk action, bulk delete).

### 4.27 Governance, security & admin
- **F3.19** Credit budgets & alerts per member/table; hard caps.
- **F3.20** Data retention controls; field-level redaction for sensitive data.
- **F3.21** SSO placeholder + role-based access control screens.
- **F3.22** Export/audit of all workspace activity.

### 4.28 Reporting & insights
- **F3.23** Pipeline/coverage analytics (match rates per provider, enrichment coverage %, signal volume over time).
- **F3.24** Workflow performance (rows processed, success/error rates, credits per outcome).
- **F3.25** Shareable dashboards.

### 4.29 Quality-of-life & polish
- **F3.26** Command palette (⌘K) for navigation and actions.
- **F3.27** Keyboard-first grid navigation (arrow keys, copy/paste ranges, fill-down).
- **F3.28** Undo/redo across table edits.
- **F3.29** Dark mode.
- **F3.30** Onboarding tour + empty-state guidance.

**V3 Definition of Done:** A team collaborates in real time on cross-table, branching workflows built partly by an AI assistant, using deployed custom agents and connected (mock) integrations, governed by roles, budgets, and an audit trail, with reporting dashboards.

---

## 5. Feature Matrix (quick reference)

| Capability | V1 | V2 | V3 |
|---|:--:|:--:|:--:|
| Mock auth + workspace shell | ✅ | ✅ | ✅ |
| Spreadsheet grid (virtualized) | ✅ | ✅ | ✅ |
| Manual rows / CSV import | ✅ | ✅ | ✅ |
| Single-provider enrichment (mock) | ✅ | ✅ | ✅ |
| AI research column (mock) | ✅ | ✅ | ✅ |
| Run cell/column/table + statuses | ✅ | ✅ | ✅ |
| Credits (track/decrement/block) | ✅ | ✅ | ✅ |
| CSV export + local persistence | ✅ | ✅ | ✅ |
| **Waterfall enrichment** | — | ✅ | ✅ |
| Conditional run logic | — | ✅ | ✅ |
| Formula columns | — | ✅ | ✅ |
| Lead scoring / conditional formatting | — | ✅ | ✅ |
| Signals & intent monitoring | — | ✅ | ✅ |
| People/company discovery search | — | ✅ | ✅ |
| CRM / sequencer write-back (mock) | — | ✅ | ✅ |
| Filters, sorts, saved views | — | ✅ | ✅ |
| Templates gallery | — | ✅ | ✅ |
| Scheduling / auto-run | — | ✅ | ✅ |
| Usage analytics dashboard | — | ✅ | ✅ |
| Multi-user roles & permissions | — | — | ✅ |
| Real-time presence + comments | — | — | ✅ |
| AI workflow builder (NL → table) | — | — | ✅ |
| Agent studio (build/deploy agents) | — | — | ✅ |
| Integrations marketplace | — | — | ✅ |
| Cross-table & branching workflows | — | — | ✅ |
| Inbound webhook triggers | — | — | ✅ |
| Governance / budgets / audit | — | — | ✅ |
| Reporting dashboards | — | — | ✅ |
| Command palette / keyboard grid / undo | — | — | ✅ |
| Dark mode | — | — | ✅ |

---

## 6. Screen Inventory (frontend pages/components to build)

**V1**
- `/(auth)/login` — mock auth
- `/app` — workspace shell (sidebar + topbar + canvas)
- Table grid component (virtualized)
- Column-type picker modal
- Provider catalog modal
- AI prompt editor panel
- CSV import wizard
- Run progress toast/panel
- Credit balance pill + low-credit modal
- Workspace settings page

**V2 (adds)**
- Waterfall builder panel (drag-order steps)
- Condition builder component
- Formula editor
- Signals feed view
- Discovery/search panel
- Write-back action config (field mapping)
- Filter/sort bar + saved-views menu
- Template gallery
- Schedule config modal
- Usage analytics dashboard

**V3 (adds)**
- Members & roles admin
- Comments/presence layer
- AI assistant chat panel + NL workflow generator
- Agent studio (create/test/deploy/version)
- Integrations marketplace + connection flows
- Cross-table lookup config; branching builder
- Webhook trigger config + event log
- Governance (budgets, retention, audit) screens
- Reporting dashboards
- Command palette; dark-mode theming

---

## 7. Non-Functional Requirements
- **Performance:** grid stays smooth at 5,000+ rows (virtualization mandatory).
- **Resilience:** a failed enrichment on one row never blocks others; isolated per-cell errors with retry.
- **Extensibility:** all enrichment/AI/action logic behind typed adapter interfaces so mocks → real backends swap cleanly.
- **Persistence:** no data loss on refresh (localStorage in V1; backend in V2+).
- **Accessibility:** keyboard navigation for the grid; sufficient contrast; focus states.
- **Responsiveness:** desktop-first; gracefully usable down to tablet width.

---

## 8. Suggested Build Order (for Claude Code)
1. App shell + routing + mock auth + sidebar/topbar.
2. Object model + data-service abstraction + localStorage persistence.
3. Virtualized grid with static column types + inline editing.
4. Adapter interface + mock providers + single enrichment column + run engine + statuses.
5. AI research column (mock adapter) + prompt editor with column variables.
6. Credits system + CSV import/export. → **Ship V1.**
7. Waterfall + conditions + formulas + scoring.
8. Signals + discovery + write-back + views + templates + scheduling + usage dashboard. → **Ship V2.**
9. Collaboration + AI builder + agent studio + marketplace + orchestration + governance + reporting + polish. → **Ship V3.**

---

*End of FSD.*