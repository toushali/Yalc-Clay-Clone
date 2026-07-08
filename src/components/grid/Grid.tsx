"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  type ColumnDef,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Plus, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import { isStaticColumnType } from "@/lib/types";
import type { Column, Row, StaticColumnType } from "@/lib/types";
import { Checkbox, Menu, MenuItem } from "@/components/ui";
import { CellEditor, type EditDirection, formatValue, GridCell } from "./GridCell";
import { HeaderCell } from "./HeaderCell";
import {
  DEFAULT_COL_WIDTH,
  GUTTER_WIDTH,
  HEADER_HEIGHT,
  MIN_COL_WIDTH,
  ROW_HEIGHT,
} from "./constants";

const ADD_TYPES: { type: StaticColumnType; label: string }[] = [
  { type: "text", label: "Text" },
  { type: "number", label: "Number" },
  { type: "url", label: "URL" },
  { type: "email", label: "Email" },
];

export interface GridProps {
  columns: Column[];
  rows: Row[];
  /** Header click opens the config drawer (wired in S10). */
  onHeaderClick?: (columnId: string) => void;
}

interface ActiveCell {
  r: number;
  c: number;
}

export function Grid({ columns, rows, onHeaderClick }: GridProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Store mutations (no-op when there's no current table, e.g. the preview).
  const updateCell = useAppStore((s) => s.updateCell);
  const addRows = useAppStore((s) => s.addRows);
  const deleteRows = useAppStore((s) => s.deleteRows);
  const addColumn = useAppStore((s) => s.addColumn);
  const renameColumn = useAppStore((s) => s.renameColumn);
  const deleteColumn = useAppStore((s) => s.deleteColumn);
  const moveColumn = useAppStore((s) => s.moveColumn);
  const resizeColumn = useAppStore((s) => s.resizeColumn);

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [anchor, setAnchor] = useState<number | null>(null);
  const [active, setActive] = useState<ActiveCell | null>(null);
  const [editing, setEditing] = useState(false);
  const [editSeed, setEditSeed] = useState("");
  const [resizeOverride, setResizeOverride] = useState<Record<string, number>>({});
  const resizeRef = useRef<{ id: string; startX: number; startW: number } | null>(null);

  // Reset transient state when the table identity changes.
  const tableKey = columns.map((c) => c.id).join("|");
  useEffect(() => {
    setSelected(new Set());
    setAnchor(null);
    setActive(null);
    setEditing(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableKey]);

  const columnDefs = useMemo<ColumnDef<Row>[]>(
    () => columns.map((c) => ({ id: c.id })),
    [columns],
  );
  const table = useReactTable({
    data: rows,
    columns: columnDefs,
    getCoreRowModel: getCoreRowModel(),
  });
  const rowModel = table.getRowModel();

  const virtualizer = useVirtualizer({
    count: rowModel.rows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 12,
  });

  const widthOf = useCallback(
    (col: Column) => resizeOverride[col.id] ?? col.width ?? DEFAULT_COL_WIDTH,
    [resizeOverride],
  );
  const leftOffsets = useMemo(() => {
    const offs: number[] = [];
    let x = GUTTER_WIDTH;
    for (const col of columns) {
      offs.push(x);
      x += widthOf(col);
    }
    return offs;
  }, [columns, widthOf]);
  const totalWidth = GUTTER_WIDTH + columns.reduce((s, c) => s + widthOf(c), 0);

  // ── Scroll a cell into view ────────────────────────────────────────────────
  const ensureVisible = useCallback(
    (r: number, c: number) => {
      virtualizer.scrollToIndex(r, { align: "auto" });
      const el = scrollRef.current;
      if (!el) return;
      const left = leftOffsets[c];
      const right = left + widthOf(columns[c]);
      const frozenLeft = GUTTER_WIDTH + (c > 0 ? widthOf(columns[0]) : 0);
      if (right > el.scrollLeft + el.clientWidth) {
        el.scrollLeft = right - el.clientWidth;
      } else if (left < el.scrollLeft + frozenLeft) {
        el.scrollLeft = left - frozenLeft;
      }
    },
    [virtualizer, leftOffsets, columns, widthOf],
  );

  // ── Editing ────────────────────────────────────────────────────────────────
  const selectCell = useCallback((r: number, c: number) => {
    setActive({ r, c });
    setEditing(false);
    scrollRef.current?.focus();
  }, []);

  const startEdit = useCallback(
    (r: number, c: number, seed?: string) => {
      if (!isStaticColumnType(columns[c].type)) return;
      setActive({ r, c });
      setEditSeed(seed ?? formatValue(rows[r]?.cells[columns[c].id]?.value, columns[c].type));
      setEditing(true);
    },
    [columns, rows],
  );

  const commitEdit = useCallback(
    (value: string, dir: EditDirection) => {
      if (!active) return;
      const col = columns[active.c];
      const row = rows[active.r];
      let coerced: string | number | null = value;
      if (col.type === "number") {
        const t = value.trim();
        coerced = t === "" ? null : Number.isNaN(Number(t)) ? t : Number(t);
      } else if (value === "") {
        coerced = null;
      }
      if (row) updateCell(row.id, col.id, coerced);
      setEditing(false);
      if (dir === "down") {
        const nr = Math.min(rows.length - 1, active.r + 1);
        setActive({ r: nr, c: active.c });
        ensureVisible(nr, active.c);
      } else if (dir === "right") {
        const nc = Math.min(columns.length - 1, active.c + 1);
        setActive({ r: active.r, c: nc });
        ensureVisible(active.r, nc);
      }
      scrollRef.current?.focus();
    },
    [active, columns, rows, updateCell, ensureVisible],
  );

  const cancelEdit = useCallback(() => {
    setEditing(false);
    scrollRef.current?.focus();
  }, []);

  // ── Keyboard navigation ──────────────────────────────────────────────────
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (editing) return;
    if (!active) {
      if (e.key.startsWith("Arrow")) {
        e.preventDefault();
        selectCell(0, 0);
      }
      return;
    }
    const { r, c } = active;
    const move = (nr: number, nc: number) => {
      e.preventDefault();
      const cr = Math.max(0, Math.min(rows.length - 1, nr));
      const cc = Math.max(0, Math.min(columns.length - 1, nc));
      setActive({ r: cr, c: cc });
      ensureVisible(cr, cc);
    };
    switch (e.key) {
      case "ArrowUp":
        return move(r - 1, c);
      case "ArrowDown":
        return move(r + 1, c);
      case "ArrowLeft":
        return move(r, c - 1);
      case "ArrowRight":
      case "Tab":
        return move(r, c + 1);
      case "Enter":
      case "F2":
        e.preventDefault();
        return startEdit(r, c);
      case "Backspace":
      case "Delete":
        e.preventDefault();
        if (isStaticColumnType(columns[c].type) && rows[r]) {
          updateCell(rows[r].id, columns[c].id, null);
        }
        return;
      default:
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
          e.preventDefault();
          startEdit(r, c, e.key);
        }
    }
  };

  // ── Selection ──────────────────────────────────────────────────────────────
  const allSelected = rows.length > 0 && selected.size === rows.length;
  const someSelected = selected.size > 0 && !allSelected;
  const toggleAll = () =>
    setSelected(allSelected ? new Set() : new Set(rows.map((r) => r.id)));
  const toggleRow = (index: number, shift: boolean) => {
    const id = rows[index].id;
    setSelected((prev) => {
      const next = new Set(prev);
      if (shift && anchor !== null) {
        const [lo, hi] = [Math.min(anchor, index), Math.max(anchor, index)];
        for (let i = lo; i <= hi; i++) next.add(rows[i].id);
      } else if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
    setAnchor(index);
  };

  // ── Resize ───────────────────────────────────────────────────────────────
  const startResize = (col: Column) => (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    resizeRef.current = { id: col.id, startX: e.clientX, startW: widthOf(col) };
    const onMove = (ev: PointerEvent) => {
      const st = resizeRef.current;
      if (!st) return;
      const w = Math.max(MIN_COL_WIDTH, st.startW + (ev.clientX - st.startX));
      setResizeOverride({ [st.id]: w });
    };
    const onUp = () => {
      const st = resizeRef.current;
      const w = st ? resizeOverride[st.id] : undefined;
      if (st && w != null) resizeColumn(st.id, w);
      resizeRef.current = null;
      setResizeOverride({});
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  if (columns.length === 0) {
    return (
      <div className="grid h-full place-items-center bg-bg p-8 text-center">
        <p className="text-sm text-text-muted">This table has no columns yet.</p>
      </div>
    );
  }

  return (
    <div className="relative flex h-full flex-col">
      {/* Selection bar */}
      {selected.size > 0 && (
        <div className="absolute left-1/2 top-3 z-30 flex -translate-x-1/2 items-center gap-3 rounded-md border border-border bg-bg px-3 py-1.5 shadow-lg">
          <span className="text-sm font-medium text-text">
            {selected.size} selected
          </span>
          <button
            onClick={() => {
              deleteRows([...selected]);
              setSelected(new Set());
            }}
            className="flex items-center gap-1 text-sm text-[var(--color-status-error)] hover:underline"
          >
            <Trash2 size={14} /> Delete
          </button>
          <button
            onClick={() => setSelected(new Set())}
            className="text-text-faint hover:text-text"
            aria-label="Clear selection"
          >
            <X size={14} />
          </button>
        </div>
      )}

      <div
        ref={scrollRef}
        tabIndex={0}
        onKeyDown={onKeyDown}
        className="relative h-full select-none overflow-auto bg-bg outline-none"
      >
        <div style={{ width: totalWidth }}>
          {/* Sticky header */}
          <div className="sticky top-0 z-20 flex" style={{ height: HEADER_HEIGHT }}>
            <div
              className="sticky left-0 z-10 flex items-center justify-center border-b border-r border-border-strong bg-bg-subtle"
              style={{ width: GUTTER_WIDTH }}
            >
              <Checkbox
                checked={allSelected}
                indeterminate={someSelected}
                onChange={toggleAll}
                aria-label="Select all rows"
              />
            </div>
            {columns.map((col, i) => (
              <HeaderCell
                key={col.id}
                column={col}
                index={i}
                count={columns.length}
                frozen={i === 0}
                style={{ width: widthOf(col), ...(i === 0 ? { left: GUTTER_WIDTH } : {}) }}
                onOpenConfig={() => onHeaderClick?.(col.id)}
                onRename={(name) => renameColumn(col.id, name)}
                onMove={(to) => moveColumn(col.id, to)}
                onDelete={() => deleteColumn(col.id)}
                onResizeStart={startResize(col)}
              />
            ))}
            {/* Add column */}
            <Menu
              align="end"
              trigger={
                <button
                  aria-label="Add column"
                  className="flex h-full items-center justify-center border-b border-r border-border-strong bg-bg-subtle px-3 text-text-faint hover:bg-border/40 hover:text-text"
                  style={{ width: 44 }}
                >
                  <Plus size={16} />
                </button>
              }
            >
              {ADD_TYPES.map((t) => (
                <MenuItem key={t.type} onClick={() => addColumn(t.type)}>
                  {t.label}
                </MenuItem>
              ))}
            </Menu>
          </div>

          {/* Virtualized body */}
          <div className="relative" style={{ height: virtualizer.getTotalSize() }}>
            {rowModel.rows.length === 0 && (
              <p className="absolute left-0 top-3 w-full text-center text-sm text-text-faint">
                No rows yet — add one below.
              </p>
            )}
            {virtualizer.getVirtualItems().map((vi) => {
              const original = rowModel.rows[vi.index].original;
              const isSelected = selected.has(original.id);
              return (
                <div
                  key={original.id}
                  className={cn(
                    "group absolute left-0 flex hover:bg-bg-subtle",
                    isSelected && "bg-accent/5",
                  )}
                  style={{
                    transform: `translateY(${vi.start}px)`,
                    height: ROW_HEIGHT,
                    width: totalWidth,
                  }}
                >
                  {/* Gutter: row number / selection checkbox */}
                  <div
                    className={cn(
                      "sticky left-0 z-10 flex items-center justify-center border-b border-r border-border text-xs text-text-faint tabular-nums group-hover:bg-bg-subtle",
                      isSelected ? "bg-accent/5" : "bg-bg",
                    )}
                    style={{ width: GUTTER_WIDTH }}
                  >
                    {isSelected ? (
                      <Checkbox
                        checked
                        onChange={() => {}}
                        onClick={(e) => toggleRow(vi.index, e.shiftKey)}
                        aria-label={`Row ${vi.index + 1}`}
                      />
                    ) : (
                      <>
                        <span className="group-hover:hidden">{vi.index + 1}</span>
                        <span className="hidden group-hover:block">
                          <Checkbox
                            checked={false}
                            onChange={() => {}}
                            onClick={(e) => toggleRow(vi.index, e.shiftKey)}
                            aria-label={`Row ${vi.index + 1}`}
                          />
                        </span>
                      </>
                    )}
                  </div>

                  {columns.map((col, i) => {
                    const isActive = active?.r === vi.index && active?.c === i;
                    const frozen = i === 0;
                    const style = {
                      width: widthOf(col),
                      ...(frozen ? { left: GUTTER_WIDTH } : {}),
                    };
                    if (isActive && editing) {
                      return (
                        <CellEditor
                          key={col.id}
                          initialValue={editSeed}
                          type={col.type}
                          frozen={frozen}
                          style={style}
                          onCommit={commitEdit}
                          onCancel={cancelEdit}
                        />
                      );
                    }
                    return (
                      <GridCell
                        key={col.id}
                        cell={original.cells[col.id]}
                        type={col.type}
                        frozen={frozen}
                        active={isActive}
                        style={style}
                        onMouseDown={() => selectCell(vi.index, i)}
                        onDoubleClick={() => startEdit(vi.index, i)}
                      />
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* Add row */}
          <div
            className="sticky left-0 flex h-9 items-center border-b border-border bg-bg"
            style={{ width: 260 }}
          >
            <button
              onClick={() => addRows(1)}
              className="flex h-full items-center gap-1.5 px-3 text-sm text-text-muted hover:text-text"
            >
              <Plus size={15} /> New row
            </button>
            <Menu
              align="start"
              trigger={
                <button className="h-full px-2 text-text-faint hover:text-text" aria-label="Add multiple rows">
                  •••
                </button>
              }
            >
              <MenuItem onClick={() => addRows(10)}>Add 10 rows</MenuItem>
              <MenuItem onClick={() => addRows(100)}>Add 100 rows</MenuItem>
            </Menu>
          </div>
        </div>
      </div>
    </div>
  );
}
