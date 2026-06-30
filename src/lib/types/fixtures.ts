/**
 * Sample domain objects — exercise the type model and double as seed data for
 * the default workspace (consumed by the data-service/store in S3–S4).
 */
import { emptyCell } from "./cell";
import type { Column } from "./column";
import type { Row } from "./row";
import type { Table } from "./table";
import type { Workspace } from "./workspace";

const SEED_TS = 0; // fixed; real timestamps are stamped at creation time.

const peopleColumns: Column[] = [
  { id: "col_name", name: "Name", type: "text", width: 200 },
  { id: "col_company", name: "Company Domain", type: "url", width: 200 },
  {
    id: "col_email",
    name: "Work Email",
    type: "enrichment",
    width: 240,
    config: { providerId: "work_email_finder", inputMapping: { domain: "col_company" } },
  },
  {
    id: "col_summary",
    name: "Account Summary",
    type: "ai_research",
    width: 320,
    config: {
      prompt: "Summarize what {Company Domain} does in one sentence.",
      outputMode: "text",
    },
  },
];

const makeRow = (id: string, name: string, domain: string): Row => ({
  id,
  cells: {
    col_name: { value: name, status: "success" },
    col_company: { value: domain, status: "success" },
    col_email: emptyCell(),
    col_summary: emptyCell(),
  },
});

export const SAMPLE_TABLE: Table = {
  id: "tbl_sample",
  name: "Sample People",
  type: "people",
  columns: peopleColumns,
  rows: [
    makeRow("row_1", "Ada Lovelace", "analytical-engine.com"),
    makeRow("row_2", "Alan Turing", "enigma.io"),
  ],
  createdAt: SEED_TS,
  updatedAt: SEED_TS,
};

export const SAMPLE_WORKSPACE: Workspace = {
  id: "ws_default",
  name: "My Workspace",
  members: [
    { id: "mbr_me", name: "You", email: "you@example.com", role: "admin" },
  ],
  creditBalance: 1000,
  createdAt: SEED_TS,
};
