# Yalc — A Clay Clone (GTM Data Enrichment & Workflow Workspace)

Yalc is a **programmable, spreadsheet-style workspace** for go-to-market (GTM) teams — a clone of [app.clay.com](https://app.clay.com)'s product. Build tables where each column can pull data from providers, run AI research, compute formulas, or push records to a CRM. This repo is the **product application frontend** (the post-login workspace), not a marketing site.

> Full functional spec: see [`fsd.md`](./fsd.md). Build conventions for AI/dev agents: see [`CLAUDE.md`](./CLAUDE.md).

---

## What it does (core loop)

- Each **row** is a record (person or company).
- Each **column** is data, an **enrichment**, an **AI research step**, a **formula**, or a **write-back action**.
- Columns run per-row; tables run per-column — together forming a workflow.
- **Waterfall enrichment:** query multiple providers in sequence until one returns a value.
- **AI research ("Researcher"):** a column that runs natural-language web research per row.
- **Signals:** monitor records for triggers (funding, job changes, hiring) to time outreach.
- **Credits:** every enrichment/AI action consumes credits; usage is always visible.

---

## Design direction

The product UI follows **Clay's app design language** — a clean, dense, productivity-tool aesthetic (think Airtable × Notion × Linear):

- **Light, neutral theme.** White/near-white canvas (`#fff` / `#fafafa`), subtle gray borders (`#ececec`), high-contrast near-black text. Dark mode comes in V3.
- **The grid is the hero.** Compact rows (~36px), thin 1px cell borders, sticky header + sticky first column, hover row highlight, clear selected-cell ring.
- **Left sidebar** (collapsible): workspace switcher, table list, "+ New table", settings — quiet grays, the active item subtly highlighted.
- **Top bar:** editable table name, run controls, a **credit balance pill**, user avatar.
- **Right-side config drawer:** clicking a column header opens a slide-in panel to configure its type, inputs, provider/prompt, and run conditions. This is central to the Clay feel.
- **Cell status as color pills/dots:** idle (gray), running (animated), success (green), error (red), empty (muted), skipped (amber).
- **Accent color** used sparingly (a single brand hue for primary buttons, active states, links). Keep chrome neutral so data stands out.
- **Typography:** clean sans (Inter or similar). Tabular numbers in the grid. Small, legible labels.
- **Motion:** quick and functional (150–250ms). Drawers slide, cells pulse while running. No decorative animation — this is a tool, not a landing page.
- **Density first:** maximize visible data, minimize padding, but keep generous click targets on controls.

---

## Tech stack

- **Next.js (App Router) + TypeScript**
- **Tailwind CSS**
- **Virtualized grid:** TanStack Table + TanStack Virtual (mandatory for performance)
- **State:** local state in V1 → client store (Zustand) as tables grow
- **Data layer:** in-memory mock + localStorage in V1, behind a typed data-service abstraction so a real backend (e.g. FastAPI + Supabase/Postgres) can be swapped in later without UI changes
- **Enrichment/AI/actions:** typed **adapter** interfaces with **mock implementations** in V1 (artificial latency + varied fake results); real adapters plug in later

> Architectural rule: **the UI never assumes real APIs exist.** Everything external is an adapter.

---

## Versions (roadmap)

| Version | Theme | Highlights |
|---|---|---|
| **V1 — MVP** | The Enrichment Table | Grid, CSV import, single-provider enrichment (mock), AI research column (mock), run engine + cell statuses, credits, export, localStorage |
| **V2 — Automation & Intelligence** | Workflow engine | Waterfall enrichment, conditional logic, formulas, lead scoring, signals, discovery search, CRM write-back, saved views, templates, scheduling, usage dashboard |
| **V3 — Clay Parity** | Collaboration & enterprise | Multi-user roles, presence + comments, AI workflow builder, agent studio, integrations marketplace, cross-table/branching orchestration, governance, reporting, command palette, dark mode |

See [`fsd.md`](./fsd.md) for the full feature matrix and per-feature IDs.

---

## Getting started

```bash
# install
npm install

# dev
npm run dev
# open http://localhost:3000

# build
npm run build && npm start
```

---

## Project structure (target)

```
src/
├── app/                      # Next.js routes
│   ├── (auth)/login/         # mock auth
│   └── app/                  # workspace shell + table routes
├── components/
│   ├── shell/                # sidebar, topbar, layout
│   ├── grid/                 # virtualized table, cells, headers
│   ├── columns/              # column-type config panels (drawer)
│   ├── modals/               # provider catalog, import wizard, etc.
│   └── ui/                   # primitives (button, drawer, pill, etc.)
├── lib/
│   ├── adapters/             # enrichment / ai / action adapters (mock + interfaces)
│   ├── store/                # client state
│   ├── data/                 # data-service abstraction + persistence
│   └── types/                # shared object model types
└── styles/
```

---

## Status

Frontend-first build, in progress. V1 is the near-term shippable target; V2/V3 are the roadmap.

*Not affiliated with or endorsed by Clay. "Clay" is a trademark of its respective owner. This is an educational clone.*