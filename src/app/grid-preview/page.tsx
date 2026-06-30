"use client";

/**
 * Throwaway S6 verification page: renders the Grid with 5,000 synthetic rows
 * and many columns to confirm virtualization (only the visible window mounts)
 * and sticky header / frozen column behavior. Removed in the S15 polish pass.
 */
import { useMemo } from "react";
import { Grid } from "@/components/grid";
import type { Column, Row } from "@/lib/types";

const COL_COUNT = 12;
const ROW_COUNT = 5000;

function build(): { columns: Column[]; rows: Row[] } {
  const columns: Column[] = Array.from({ length: COL_COUNT }, (_, c) => ({
    id: `col_${c}`,
    name: c === 0 ? "Name" : `Field ${c}`,
    type: c === 0 ? "text" : c % 3 === 0 ? "number" : c % 3 === 1 ? "url" : "email",
    width: c === 0 ? 200 : 160,
  }));

  const rows: Row[] = Array.from({ length: ROW_COUNT }, (_, r) => {
    const cells: Row["cells"] = {};
    for (let c = 0; c < COL_COUNT; c++) {
      const type = columns[c].type;
      const value =
        type === "number"
          ? r * 10 + c
          : type === "url"
            ? `example-${r}.com`
            : type === "email"
              ? `user${r}@example.com`
              : `Row ${r + 1}`;
      cells[`col_${c}`] = { value, status: "success" };
    }
    return { id: `row_${r}`, cells };
  });

  return { columns, rows };
}

export default function GridPreviewPage() {
  const { columns, rows } = useMemo(build, []);
  return (
    <div className="flex h-screen flex-col">
      <div className="border-b border-border px-4 py-2 text-sm text-text-muted">
        Grid preview — {ROW_COUNT.toLocaleString()} rows × {COL_COUNT} columns
      </div>
      <div className="min-h-0 flex-1">
        <Grid columns={columns} rows={rows} />
      </div>
    </div>
  );
}
