"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { Cell, CellValue, ColumnType } from "@/lib/types";

/** Read-only display formatting per column type. */
export function formatValue(
  value: CellValue | undefined,
  type: ColumnType,
): string {
  if (value == null || value === "") return "";
  if (type === "number" && typeof value === "number") return value.toLocaleString();
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

export type EditDirection = "down" | "right" | null;

export function GridCell({
  cell,
  type,
  frozen,
  active,
  style,
  onMouseDown,
  onDoubleClick,
}: {
  cell: Cell | undefined;
  type: ColumnType;
  frozen?: boolean;
  active?: boolean;
  style?: React.CSSProperties;
  onMouseDown?: (e: React.MouseEvent) => void;
  onDoubleClick?: () => void;
}) {
  const display = formatValue(cell?.value, type);
  const isLink = (type === "url" || type === "email") && display !== "";

  return (
    <div
      style={style}
      onMouseDown={onMouseDown}
      onDoubleClick={onDoubleClick}
      className={cn(
        "flex h-full items-center overflow-hidden border-b border-r border-border px-2.5 text-sm tabular-nums",
        frozen ? "sticky bg-bg group-hover:bg-bg-subtle" : "bg-transparent",
        active
          ? "z-20 outline outline-2 -outline-offset-1 outline-accent"
          : frozen
            ? "z-10"
            : "",
      )}
    >
      <span
        className={cn("truncate", isLink ? "text-accent" : "text-text")}
        title={display || undefined}
      >
        {display}
      </span>
    </div>
  );
}

/** Inline editor for static cells (F1.10). */
export function CellEditor({
  initialValue,
  type,
  frozen,
  style,
  onCommit,
  onCancel,
}: {
  initialValue: string;
  type: ColumnType;
  frozen?: boolean;
  style?: React.CSSProperties;
  onCommit: (value: string, dir: EditDirection) => void;
  onCancel: () => void;
}) {
  const [value, setValue] = useState(initialValue);
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.focus();
    // Caret at end so typed-to-edit keeps appending.
    const len = el.value.length;
    el.setSelectionRange(len, len);
  }, []);

  return (
    <div
      style={style}
      className={cn(
        "z-20 flex h-full border-b border-r border-border",
        frozen ? "sticky bg-bg" : "bg-bg",
      )}
    >
      <input
        ref={ref}
        value={value}
        inputMode={type === "number" ? "decimal" : "text"}
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => onCommit(value, null)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onCommit(value, "down");
          } else if (e.key === "Tab") {
            e.preventDefault();
            onCommit(value, "right");
          } else if (e.key === "Escape") {
            e.preventDefault();
            onCancel();
          }
          e.stopPropagation();
        }}
        className="h-full w-full bg-transparent px-2.5 text-sm text-text outline outline-2 -outline-offset-1 outline-accent"
      />
    </div>
  );
}
