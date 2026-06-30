"use client";

import { useMemo, useRef } from "react";
import {
  type ColumnDef,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import type { Column, Row } from "@/lib/types";
import { GridCell } from "./GridCell";
import { HeaderCell } from "./HeaderCell";
import {
  DEFAULT_COL_WIDTH,
  GUTTER_WIDTH,
  HEADER_HEIGHT,
  ROW_HEIGHT,
} from "./constants";

export interface GridProps {
  columns: Column[];
  rows: Row[];
  /** Header click opens the config drawer (wired in S10). */
  onHeaderClick?: (columnId: string) => void;
}

/**
 * Virtualized data grid (F1.7, F1.12). Only the visible row window is in the
 * DOM. Sticky header + a frozen gutter and first data column stay pinned during
 * scroll. Read-only here; inline editing arrives in S7.
 */
export function Grid({ columns, rows, onHeaderClick }: GridProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const colMap = useMemo(
    () => new Map(columns.map((c) => [c.id, c])),
    [columns],
  );

  const columnDefs = useMemo<ColumnDef<Row>[]>(
    () => columns.map((c) => ({ id: c.id, size: c.width ?? DEFAULT_COL_WIDTH })),
    [columns],
  );

  const table = useReactTable({
    data: rows,
    columns: columnDefs,
    getCoreRowModel: getCoreRowModel(),
    defaultColumn: { size: DEFAULT_COL_WIDTH },
  });

  const leaf = table.getVisibleLeafColumns();
  const rowModel = table.getRowModel();

  const virtualizer = useVirtualizer({
    count: rowModel.rows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 12,
  });

  const totalWidth = GUTTER_WIDTH + leaf.reduce((sum, c) => sum + c.getSize(), 0);

  if (columns.length === 0) {
    return (
      <div className="grid h-full place-items-center bg-bg p-8 text-center">
        <p className="text-sm text-text-muted">
          This table has no columns yet.
        </p>
      </div>
    );
  }

  return (
    <div ref={scrollRef} className="relative h-full overflow-auto bg-bg">
      <div style={{ width: totalWidth }}>
        {/* Sticky header */}
        <div
          className="sticky top-0 z-20 flex"
          style={{ height: HEADER_HEIGHT }}
        >
          <div
            className="sticky left-0 z-10 border-b border-r border-border-strong bg-bg-subtle"
            style={{ width: GUTTER_WIDTH }}
          />
          {leaf.map((lc, i) => {
            const col = colMap.get(lc.id)!;
            const frozen = i === 0;
            return (
              <HeaderCell
                key={lc.id}
                name={col.name}
                type={col.type}
                frozen={frozen}
                onClick={() => onHeaderClick?.(lc.id)}
                style={{
                  width: lc.getSize(),
                  ...(frozen ? { left: GUTTER_WIDTH } : {}),
                }}
              />
            );
          })}
        </div>

        {/* Virtualized body */}
        <div className="relative" style={{ height: virtualizer.getTotalSize() }}>
          {rowModel.rows.length === 0 && (
            <p className="absolute left-0 top-3 w-full text-center text-sm text-text-faint">
              No rows yet.
            </p>
          )}
          {virtualizer.getVirtualItems().map((vi) => {
            const row = rowModel.rows[vi.index];
            const original = row.original;
            return (
              <div
                key={row.id}
                className="group absolute left-0 flex hover:bg-bg-subtle"
                style={{
                  transform: `translateY(${vi.start}px)`,
                  height: ROW_HEIGHT,
                  width: totalWidth,
                }}
              >
                <div
                  className="sticky left-0 z-10 flex items-center justify-center border-b border-r border-border bg-bg text-xs text-text-faint tabular-nums group-hover:bg-bg-subtle"
                  style={{ width: GUTTER_WIDTH }}
                >
                  {vi.index + 1}
                </div>
                {leaf.map((lc, i) => {
                  const col = colMap.get(lc.id)!;
                  const frozen = i === 0;
                  return (
                    <GridCell
                      key={lc.id}
                      cell={original.cells[lc.id]}
                      type={col.type}
                      frozen={frozen}
                      style={{
                        width: lc.getSize(),
                        ...(frozen ? { left: GUTTER_WIDTH } : {}),
                      }}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
