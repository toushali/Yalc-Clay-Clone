# Functional Specification Document — COMPLETE (Full-Stack)
## Yalc - A Clay Clone (GTM Data Enrichment & Workflow Platform)

**Document type:** Complete Functional & Technical Specification
**Scope:** The entire product as built by Clay (`app.clay.com`) — **frontend, backend, data, infrastructure, integrations, and compliance**. This is the full-system reference, superseding the frontend-only `fsd.md` in breadth.
**Audience:** Product, engineering (frontend + backend + infra), design, and leadership.
**Status:** Draft v1

> Companion docs: `fsd.md` (frontend-only, phased build), `README.md`, `CLAUDE.md`.

---

## 0. How to read this document

This FSD is organized by **system layer**, not by build phase. Each layer lists its capabilities, the responsibilities split between client and server, and key technical considerations. A consolidated **build-phase mapping** (MVP → Growth → Enterprise) appears in §16, and a **full feature matrix** in §17.

Legend for ownership:
- **FE** = frontend / client
- **BE** = backend / server
- **FS** = full-stack (meaningful work on both sides)
- **INF** = infrastructure / platform

---

## 1. Product Overview

Yalc is a **programmable GTM data platform**: a spreadsheet-style workspace where revenue teams source, enrich, research, score, and route prospect data, then hand it off to outreach systems — without stitching together 50 separate tools.

**The defining pillars (must exist for the product to "be Clay"):**
1. **Spreadsheet/table workspace** — rows are records, columns are data/enrichment/AI/formula/action steps.
2. **Waterfall enrichment** — query many data providers in sequence; pay only for matches.
3. **AI research agent ("Claygent"/"Researcher")** — natural-language web research per row, structured output.
4. **Signals & intent** — monitor records for buying triggers and time outreach.
5. **Credit-based metering** — every external action consumes credits; usage is visible and billable.
6. **Integrations** — import sources + write-back destinations (CRMs, sequencers, warehouses, webhooks).
7. **Automation** — conditional logic, scheduling, auto-run, and workflow orchestration.
8. **Collaboration & governance** — multi-user, roles, audit, budgets (enterprise).

---

## 2. System Architecture (high level)

```
┌──────────────────────────────────────────────────────────────────┐
│  CLIENT (Next.js / React, TypeScript)                              │
│  - Workspace shell, virtualized grid, column drawers              │
│  - Real-time collaboration client (WebSocket)                     │
│  - Auth client, billing UI, dashboards                            │
└───────────────┬──────────────────────────────────────────────────┘
                │  HTTPS (REST + tRPC/GraphQL)  +  WSS (realtime)
┌───────────────▼──────────────────────────────────────────────────┐
│  API GATEWAY / BFF                                                 │
│  - AuthN/AuthZ, rate limiting, request validation, routing        │
└───────┬─────────────┬───────────────┬───────────────┬────────────┘
        │             │               │               │
┌───────▼──────┐ ┌────▼───────┐ ┌─────▼────────┐ ┌────▼───────────┐
│ Core API     │ │ Run Engine │ │ Integrations │ │ Billing/Credits│
│ (CRUD,       │ │ (workers + │ │ Service      │ │ Service        │
│  tables,     │ │  queue)    │ │ (CRM, seq,   │ │ (metering,     │
│  workspaces) │ │            │ │  providers)  │ │  Stripe)       │
└───────┬──────┘ └────┬───────┘ └─────┬────────┘ └────┬───────────┘
        │             │               │               │
┌───────▼─────────────▼───────────────▼───────────────▼────────────┐
│  DATA & MESSAGING LAYER                                            │
│  Postgres (primary) · Redis (cache/queues) · Object store (files) │
│  Search index · Time-series (usage) · Message broker (jobs/events)│
└───────────────┬──────────────────────────────────────────────────┘
                │
┌───────────────▼──────────────────────────────────────────────────┐
│  EXTERNAL SERVICES                                                 │
│  Data providers (150+) · LLM providers · Email/phone verify ·     │
│  CRMs · Sequencers · Warehouses · Stripe · Auth/SSO providers     │
└──────────────────────────────────────────────────────────────────┘
```

**Suggested stack (reference, not mandate):**
- **Frontend:** Next.js (App Router), TypeScript, Tailwind, TanStack Table/Virtual, Zustand, WebSocket client.
- **Backend:** Node (NestJS/Express) or Python (FastAPI); typed API (tRPC/GraphQL/REST + OpenAPI).
- **Data:** PostgreSQL (primary), Redis (cache + queues), object storage (S3-compatible) for files, OpenSearch/Elasticsearch or Postgres FTS for discovery, ClickHouse/Timescale for usage analytics.
- **Async:** a job queue/worker system (BullMQ / Celery / Temporal) for enrichment + scheduling.
- **Realtime:** WebSocket layer (e.g. Socket.IO / Ably / custom) with presence + sync.
- **Auth:** session/JWT, OAuth, SAML/OIDC SSO (e.g. WorkOS / Auth0 / custom).
- **Billing:** Stripe + a metering service.
- **Infra:** containerized (Docker/K8s), IaC, CI/CD, observability stack.

---

## 3. Authentication & Authorization  *(FS)*

**Frontend**
- Sign up, log in, log out, forgot/reset password, email verification screens.
- SSO buttons (Google, Microsoft, SAML for enterprise).
- Session handling, token refresh, "remember me," device/session list.
- Invitation acceptance flow.

**Backend**
- Email/password auth with secure hashing (argon2/bcrypt), email verification tokens.
- OAuth (Google, Microsoft) and **SAML/OIDC SSO** for enterprise; SCIM user provisioning.
- Session management (JWT access + refresh, or server sessions), token rotation, revocation.
- Multi-factor auth (TOTP, optionally SMS).
- **Role-based access control (RBAC):** roles (Owner, Admin, Builder, Member, Viewer) + permission checks on every resource.
- **Multi-tenancy isolation:** every query scoped to a workspace; no cross-tenant leakage.
- Rate limiting on auth endpoints; brute-force protection; audit of auth events.

---

## 4. Workspace, Org & User Management  *(FS)*

**Frontend**
- Workspace switcher; create/rename/delete workspace.
- Members page: invite by email, assign roles, remove members, pending invites.
- Teams/groups (enterprise); seat management.
- Personal profile & preferences (name, avatar, notifications, theme).

**Backend**
- Organizations → workspaces → members hierarchy; seat counting tied to billing.
- Invitation system (tokenized email invites, expiry).
- Role assignment + permission resolution.
- SCIM provisioning/deprovisioning (enterprise).
- Workspace-level settings store (defaults, data residency, retention policy).

---

## 5. The Table Workspace (core product)  *(FS)*

### 5.1 Tables & grid  *(FE-heavy, BE persistence)*
**Frontend**
- Virtualized spreadsheet grid (sticky header + first column), 1000s of rows performant.
- Create table (People / Company / Blank / from template); rename, duplicate, delete, archive.
- Add/edit/delete/reorder/resize columns; hide/show; freeze; group-by.
- Inline cell editing; multi-select; copy/paste ranges; fill-down; undo/redo.
- Cell status rendering (idle/running/success/error/empty/skipped) + provenance tooltip.
- Filtering, multi-sort, saved **views**.
- Keyboard-first navigation; command palette (⌘K).

**Backend**
- Table/column/row/cell persistence and versioning.
- Efficient bulk row operations (insert/update/delete thousands at once).
- Server-side filter/sort/pagination for very large tables.
- Optimistic concurrency / conflict resolution for shared editing.
- Per-cell **provenance** + status + value-history storage.

### 5.2 Column types  *(FS)*
Static: text, number, url, email, date, select/tags, boolean.
Computed/active: **enrichment**, **waterfall**, **AI research**, **formula**, **lookup** (cross-table), **action/write-back**, **signal**, **score**.

- **Frontend:** a right-side **config drawer** per column type (input mapping via `{Column}` variables, provider/prompt/formula/condition config, run settings).
- **Backend:** column config schema validation; resolution of input references at run time.

### 5.3 Formulas & conditional logic  *(FS)*
- Formula engine with a function library (text, math, logical, lookups, scoring helpers).
- **Run conditions** per column (field/operator/value with AND/OR groups) → rows that fail are `skipped` (0 credits).
- Conditional formatting (color rows/cells by value/score band).
- **Backend** evaluates formulas/conditions server-side for scheduled/automated runs (not just client-side).

---

## 6. Enrichment & Data Provider Layer  *(BE-heavy)*

This is the heart of the backend.

**Provider integration framework**
- A normalized **adapter interface** wrapping each external data provider (email finders, phone finders, firmographic/technographic, social, intent).
- 150+ providers in the real product; each declares: inputs required, outputs returned, **cost (credits)**, latency profile, rate limits, auth/keys.
- **Credential vault:** securely store provider API keys (workspace-owned or Yalc-managed pooled keys).

**Waterfall orchestration**
- Execute an ordered provider list per record; stop on first successful match.
- Record **provenance** (which provider supplied each value) and per-step cost.
- Configurable field-conflict resolution (which source wins).
- Caching of recent results to avoid re-paying for identical lookups.
- Retry/backoff on provider errors; circuit-breaking on provider outages.
- Email/phone **verification** step (validity, deliverability, catch-all detection).

**Frontend**
- Provider **catalog/marketplace** (browse by category, see cost, enable/disable).
- Waterfall builder (drag to order steps, enable/disable, per-step config).
- Coverage/match-rate display per provider.

---

## 7. AI / LLM Layer (Research Agent + AI Builder)  *(BE-heavy)*

**Research agent ("Claygent"/"Researcher")**
- Per-row natural-language research: fetch/scrape public web sources, summarize, extract structured fields.
- Prompt templating with column variables; output schemas (text / single value / JSON).
- Web-browsing/scraping subsystem (fetch, parse, respect robots, handle rate limits).
- LLM provider abstraction (swap models; manage context windows; token accounting → credits).
- Guardrails: output validation, retries on malformed output, hallucination mitigation, caching.

**AI Workflow Builder ("Sculptor" equivalent)**
- Natural-language → proposed table/columns/logic generation.
- Inline AI assistant (chat) that can add/modify columns, write formulas, tune prompts.
- Versioning + diff + rollback of AI-generated workflows.

**Agent Studio**
- Define reusable agents (system prompt, allowed tools/data, output schema).
- Test on sample rows; deploy as a column type; version + monitor.

**Frontend**
- Prompt editor with variable chips, output-type selector, test-on-row preview.
- AI assistant chat panel; agent studio create/test/deploy UI.

---

## 8. Run Engine & Async Execution  *(BE-heavy)*

The system that actually executes enrichments/AI/actions at scale.

- **Job queue + workers:** runs are jobs; workers pull from a queue (Redis/broker).
- **Scopes:** single cell, column (all rows), table, or scheduled/triggered run.
- **Concurrency control:** per-workspace and per-provider concurrency caps; fair scheduling.
- **Per-cell isolation:** one row failing never blocks others; isolated retry.
- **Idempotency:** safe re-runs; dedupe in-flight identical work.
- **Progress + events:** emit run progress, per-cell status transitions, credit consumption (streamed to client via WebSocket).
- **Cancellation:** abort a running job mid-flight.
- **Rate-limit awareness:** respect provider/LLM limits; queue and pace accordingly.
- **Dead-letter handling + observability** for failed jobs.

**Frontend**
- Run controls (run cell/column/table), live progress panel, pre-run **cost estimate**, cancel, retry.

---

## 9. Signals & Intent Monitoring  *(FS)*

- Signal types: job changes, new funding, hiring (open roles), tech-stack changes, news mentions, LinkedIn/website activity, custom signals (track any data point for change).
- **Backend:** scheduled background jobs poll sources, diff against last-known state, emit signal events; store signal history; trigger downstream automations.
- **Frontend:** a **Signals feed/view** (triggers across a table with affected record + recommended action), filter by active signal, configure custom signals.

---

## 10. Discovery / Sourcing  *(FS)*

- **People & company search:** filter by industry, size, geo, title, tech, funding, etc. → import results as rows.
- "Find people at this company" expansion (company row → contact rows).
- **Backend:** search service over provider data / internal index; pagination; credit metering on import.
- **Frontend:** search panel with filters, results preview, import-to-table.

---

## 11. Integrations  *(FS)*

**Inbound / import**
- CSV/XLSX upload + column mapping.
- CRM import (HubSpot, Salesforce, Pipedrive) — pull accounts/contacts.
- Webhooks **inbound** (create/update rows on external events).
- API ingestion.

**Outbound / write-back (actions)**
- **CRM sync:** create/update/upsert contacts, companies, deals (HubSpot, Salesforce, …) with field mapping + dedupe.
- **Sequencer handoff:** add to cadence/sequence (Outreach, Salesloft, Instantly, Smartlead, Lemlist, Reply.io).
- **Warehouse sync** (Snowflake/BigQuery), **Slack** notifications, **webhooks outbound**, **Zapier/n8n**.

**Integration framework (backend)**
- OAuth connection management per integration; token storage/refresh; connection health.
- Field-schema discovery from the destination; mapping persistence.
- Sync engine: upsert semantics, conflict handling, retry, rate-limit respect, sync logs.

**Frontend**
- Integrations **directory/marketplace** (connect/disconnect, health status).
- OAuth connection flows; per-action field-mapping UI; sync status/logs.

---

## 12. Credits, Billing & Metering  *(FS)*

**Metering (backend)**
- Every provider/AI/action run records a **usage event** (workspace, table, provider, credits, timestamp).
- Real-time credit balance computation; pre-run cost estimation; hard stop at zero.
- Budgets & alerts per workspace/member/table; hard caps (enterprise).
- Usage aggregation pipeline → analytics store.

**Billing (backend)**
- Stripe integration: plans, seats, credit packs/top-ups, invoices, proration.
- Subscription lifecycle (trial, active, past-due, canceled); webhook handling.
- Plan-gated features (e.g. CRM sync on higher tiers).

**Frontend**
- Credit balance pill; low-credit + zero-credit modals; top-up flow.
- Billing page (plan, seats, payment method, invoices, usage).
- **Usage analytics dashboard:** credits by provider/table/time (charts).

---

## 13. Automation, Scheduling & Orchestration  *(FS)*

- **Scheduling:** run a table/column on an interval (cron) to keep data fresh.
- **Auto-run on new row:** trigger configured columns when a row is added.
- **Triggers:** inbound webhook / integration event starts a workflow.
- **Cross-table workflows:** a column that reads from / writes to another table.
- **Branching:** route rows to different downstream actions by condition.
- **Bulk operations** on filtered selections (re-run, action, delete).

**Backend:** a scheduler + event/trigger system feeding the run engine; durable workflow state.
**Frontend:** schedule config, trigger setup, branching builder, bulk-op UI.

---

## 14. Collaboration, Realtime & Notifications  *(FS)*

- **Real-time co-editing:** presence (who's viewing), live cursors/selection, near-real-time cell sync (CRDT/OT or server-authoritative).
- **Comments:** on cells/rows, @mentions, threads, resolution.
- **Sharing:** share table/view via link with role-scoped access.
- **Activity feed / audit trail** per table and workspace.
- **Notifications:** in-app + email (mentions, run completion, signal fired, low credits, sync errors); notification preferences.

**Backend:** WebSocket infra, presence registry, sync/merge engine, comment store, notification service (in-app + email/Slack), audit log store.

---

## 15. Templates, Library & Education  *(FS)*

- **Template gallery:** prebuilt tables/workflows (inbound enrichment, funded-company finder, CRM cleanup, ABM list, …); instantiate into a new table.
- **Saved column/agent library:** reusable enrichments, formulas, prompts, agents shared across workspace.
- (Optional, product-level) University/learning content, certification — likely a separate CMS/site, noted for completeness.

---

## 16. Cross-Cutting Concerns (Platform)

### 16.1 Public API & Developer Platform  *(BE)*
- REST/GraphQL public API: tables, rows, enrichment, runs, exports.
- API keys + scopes; per-key rate limits; OpenAPI docs.
- Outbound webhooks (event subscriptions) + signing.
- MCP/AI-tool surface (use the platform from external AI assistants).

### 16.2 Security  *(INF/BE)*
- Encryption in transit (TLS) and at rest; secrets/credential vaulting.
- Tenant isolation enforced at the data layer; row-level security where applicable.
- Input validation, output encoding, CSRF/XSS/SQLi protections.
- Audit logging of sensitive actions; anomaly detection.
- Penetration testing; dependency scanning.

### 16.3 Privacy & Compliance  *(BE/INF)*
- GDPR/CCPA: data subject requests (export/delete), consent, DPA.
- SOC 2 controls; data residency options (enterprise).
- Configurable **data retention** + field-level redaction.
- PII handling policy across providers and storage.

### 16.4 Observability & Reliability  *(INF)*
- Centralized logging, metrics, distributed tracing, error tracking.
- Health checks, uptime monitoring, alerting/on-call.
- Backups + point-in-time recovery; disaster recovery plan; defined SLOs.
- Graceful degradation when a provider/LLM is down.

### 16.5 Performance & Scale  *(FS/INF)*
- Virtualized client grid; server-side pagination for huge tables.
- Caching (provider results, sessions, hot reads) via Redis.
- Horizontal scaling of API + workers; queue-based load smoothing.
- DB indexing/partitioning for large row volumes; read replicas.

### 16.6 Infrastructure & DevOps  *(INF)*
- Containerized services; orchestration (K8s); Infrastructure-as-Code.
- CI/CD (test, build, deploy); environment promotion (dev/staging/prod).
- Feature flags; blue-green/canary deploys; migration tooling.
- Cost monitoring (cloud + provider/LLM spend).

### 16.7 Reporting & Analytics  *(FS)*
- Coverage/match-rate analytics per provider; enrichment coverage %.
- Workflow performance (rows processed, success/error rates, credits per outcome).
- Signal volume over time; pipeline impact dashboards; shareable/exportable.

### 16.8 Admin / Internal Tooling  *(BE)*
- Internal admin console: manage workspaces, impersonate (with audit), adjust credits, inspect runs, provider health, support operations.
- Provider management (add/configure/disable providers, rotate keys, set costs).

### 16.9 Quality-of-life  *(FE)*
- Command palette, keyboard grid navigation, undo/redo, dark mode, onboarding tour, empty-state guidance, in-app help/search.

---

## 17. Build-Phase Mapping (MVP → Growth → Enterprise)

> Maps the full system above to delivery phases. Frontend phasing aligns with `fsd.md` (V1/V2/V3); this adds the backend/platform track.

### Phase 1 — MVP (single-tenant feel, mock-to-light backend)
- Auth (email/password), single workspace, table workspace + virtualized grid.
- One-provider enrichment + AI research column (real or lightly-mocked), basic run engine (sync/simple queue).
- Credits metering (basic), CSV import/export, Postgres persistence, localStorage fallback on client.

### Phase 2 — Growth (the automation platform)
- Waterfall enrichment + provider framework + credential vault.
- Real async run engine (queue + workers), conditions, formulas, scoring.
- Signals, discovery, CRM/sequencer write-back, integrations framework + OAuth.
- Saved views, templates, scheduling/auto-run, usage analytics, Stripe billing.
- Notifications, basic API.

### Phase 3 — Enterprise (collaboration, governance, scale)
- Multi-user roles, SSO/SCIM, real-time collaboration + comments + presence.
- AI workflow builder + agent studio, integrations marketplace, cross-table/branching orchestration, inbound webhooks/triggers.
- Governance (budgets, retention, audit, RBAC depth), reporting dashboards.
- Public API/developer platform, command palette, dark mode, full observability/compliance (SOC2/GDPR), HA infra.

---

## 18. Full Feature Matrix

| # | Feature / Capability | Layer | Phase |
|---|---|---|---|
| 1 | Email/password auth, verification, reset | FS | 1 |
| 2 | OAuth (Google/Microsoft) | FS | 2 |
| 3 | SSO (SAML/OIDC) + SCIM | FS | 3 |
| 4 | MFA | FS | 2 |
| 5 | RBAC (Owner/Admin/Builder/Member/Viewer) | FS | 1→3 |
| 6 | Org → workspace → member hierarchy, multi-tenancy | FS | 1 |
| 7 | Member invites, seat management | FS | 2 |
| 8 | Virtualized spreadsheet grid | FE | 1 |
| 9 | Table CRUD (create/rename/dup/delete/archive) | FS | 1 |
| 10 | Column CRUD/reorder/resize/hide/freeze/group | FS | 1 |
| 11 | Inline edit, multi-select, copy/paste, fill-down, undo/redo | FE | 1→3 |
| 12 | Cell status + provenance | FS | 1 |
| 13 | Filtering, multi-sort, saved views | FS | 2 |
| 14 | Static column types (text/number/url/email/date/select/bool) | FS | 1 |
| 15 | Single-provider enrichment | FS | 1 |
| 16 | AI research column (Researcher) | FS | 1 |
| 17 | Provider framework + catalog (150+) + credential vault | BE | 2 |
| 18 | Waterfall enrichment + provenance + conflict resolution | BE | 2 |
| 19 | Email/phone verification | BE | 2 |
| 20 | Formula columns + function library | FS | 2 |
| 21 | Run conditions (skip logic) | FS | 2 |
| 22 | Lead scoring + conditional formatting | FS | 2 |
| 23 | Run engine: cell/column/table | BE | 1 |
| 24 | Async queue + workers + concurrency control | BE | 2 |
| 25 | Cancellation, retry, idempotency, dead-letter | BE | 2 |
| 26 | Live progress + cost estimate (streamed) | FS | 1→2 |
| 27 | Signals & intent monitoring + custom signals | FS | 2 |
| 28 | Signals feed view | FE | 2 |
| 29 | People/company discovery search | FS | 2 |
| 30 | "Find people at company" expansion | FS | 2 |
| 31 | CSV/XLSX import + mapping | FS | 1 |
| 32 | CRM import (HubSpot/Salesforce/Pipedrive) | FS | 2 |
| 33 | Inbound webhooks / API ingestion | FS | 3 |
| 34 | CRM write-back (upsert + mapping + dedupe) | FS | 2 |
| 35 | Sequencer handoff (Outreach/Salesloft/Instantly/…) | FS | 2 |
| 36 | Warehouse/Slack/webhook/Zapier outbound | FS | 2→3 |
| 37 | Integration OAuth mgmt + sync engine + logs | BE | 2 |
| 38 | Integrations marketplace UI | FE | 3 |
| 39 | Credits metering + balance + hard stop | FS | 1 |
| 40 | Budgets, alerts, caps | FS | 3 |
| 41 | Stripe billing (plans/seats/top-ups/invoices) | FS | 2 |
| 42 | Usage analytics dashboard | FS | 2 |
| 43 | Scheduling (cron) + auto-run on new row | FS | 2 |
| 44 | Triggers (event-driven runs) | FS | 3 |
| 45 | Cross-table workflows | FS | 3 |
| 46 | Branching workflows | FS | 3 |
| 47 | Bulk operations | FS | 2 |
| 48 | Real-time presence + co-editing + sync | FS | 3 |
| 49 | Comments + @mentions + threads | FS | 3 |
| 50 | Share via link (role-scoped) | FS | 3 |
| 51 | Activity feed / audit trail | FS | 3 |
| 52 | Notifications (in-app + email/Slack) + prefs | FS | 2→3 |
| 53 | Templates gallery + instantiate | FS | 2 |
| 54 | Reusable column/agent/prompt library | FS | 3 |
| 55 | AI workflow builder (NL → table) | FS | 3 |
| 56 | Inline AI assistant (chat) | FS | 3 |
| 57 | Agent studio (build/test/deploy/version) | FS | 3 |
| 58 | LLM provider abstraction + token→credit accounting | BE | 1→2 |
| 59 | Web browsing/scraping subsystem | BE | 2 |
| 60 | Public API + API keys + scopes + OpenAPI | BE | 3 |
| 61 | Outbound webhooks (event subscriptions) | BE | 3 |
| 62 | MCP / external AI-tool surface | BE | 3 |
| 63 | Security (encryption, isolation, audit, scanning) | INF/BE | 1→3 |
| 64 | Privacy/compliance (GDPR/CCPA/SOC2, retention, redaction) | BE/INF | 3 |
| 65 | Observability (logging/metrics/tracing/alerting) | INF | 2→3 |
| 66 | Reliability (backups/DR/SLOs/graceful degradation) | INF | 2→3 |
| 67 | Performance/scale (caching, pagination, replicas, partitioning) | FS/INF | 2→3 |
| 68 | Infra/DevOps (containers/K8s/IaC/CI-CD/flags) | INF | 1→3 |
| 69 | Reporting & analytics dashboards | FS | 3 |
| 70 | Admin/internal console (impersonate/credits/provider mgmt) | BE | 2→3 |
| 71 | Command palette, keyboard grid, undo/redo, dark mode, onboarding | FE | 3 |

---

## 19. Core Data Model (reference)

Primary entities (PostgreSQL):

- **organizations** (id, name, billing_customer_id, plan, data_residency)
- **workspaces** (id, org_id, name, credit_balance, settings, retention_policy)
- **users** (id, email, name, avatar, mfa, status)
- **memberships** (id, user_id, workspace_id, role)
- **tables** (id, workspace_id, name, type, created_by, archived)
- **columns** (id, table_id, name, type, config_jsonb, position, run_condition)
- **rows** (id, table_id, position, status, created_at)
- **cells** (id, row_id, column_id, value_jsonb, status, provenance, updated_at)  *(or wide/jsonb row storage for scale)*
- **providers** (id, name, category, cost_credits, config, rate_limits)
- **provider_credentials** (id, workspace_id, provider_id, encrypted_secret)
- **runs** (id, workspace_id, scope, status, started_at, finished_at, credits_used)
- **usage_events** (id, workspace_id, table_id, provider_id, credits, ts)  *(→ analytics store)*
- **integrations / connections** (id, workspace_id, type, oauth_tokens, status)
- **signals** (id, workspace_id, row_id, type, payload, detected_at)
- **comments** (id, table_id, row_id, column_id, author_id, body, resolved)
- **audit_logs** (id, workspace_id, actor_id, action, target, ts, metadata)
- **api_keys** (id, workspace_id, scopes, hashed_key, rate_limit)
- **webhooks** (id, workspace_id, direction, url/event, secret)
- **schedules / triggers** (id, table_id/column_id, cron/event, enabled)
- **agents** (id, workspace_id, name, prompt, tools, output_schema, version)

> At scale, cell storage is often **JSONB per row** (one row = one record with a JSON map of column→value) rather than a row per cell, for performance. Decide early; it affects everything.

---

## 20. Key Technical Risks & Decisions

1. **Cell storage model** — row-per-cell (flexible, slower at scale) vs JSONB-per-row (fast, less granular). Pick deliberately.
2. **Run engine durability** — naive queue vs a workflow engine (Temporal) for retries, scheduling, branching. Enterprise needs the latter.
3. **Provider abstraction quality** — the whole platform's value rides on a clean, normalized provider/adapter layer with good caching and cost control.
4. **Realtime collaboration** — server-authoritative sync is simpler than full CRDT; choose based on how concurrent editing must feel.
5. **Credit accounting accuracy** — metering must be exact and race-free; it's the billing source of truth.
6. **LLM cost & determinism** — token accounting, caching, and output validation are essential to control spend and quality.
7. **Multi-tenant isolation** — must be enforced at the data layer, not just the app layer.

---

## 21. Out of Scope (explicit)
- Full native mobile apps (responsive web only).
- Building proprietary data (the product **aggregates** third-party providers; it isn't a data vendor).
- A full email-sending/deliverability engine (Yalc hands off to sequencers; it is not an ESP).

---

*End of complete FSD.*