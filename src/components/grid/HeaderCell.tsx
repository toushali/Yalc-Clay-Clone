"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  AtSign,
  ChevronDown,
  Hash,
  Link as LinkIcon,
  Pencil,
  Sparkles,
  Trash2,
  Type,
  Workflow,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Column, ColumnType } from "@/lib/types";
import { Menu, MenuItem, MenuSeparator } from "@/components/ui";

const TYPE_ICON: Record<ColumnType, React.ReactNode> = {
  text: <Type size={13} />,
  number: <Hash size={13} />,
  url: <LinkIcon size={13} />,
  email: <AtSign size={13} />,
  enrichment: <Zap size={13} />,
  ai_research: <Sparkles size={13} />,
  formula: <Hash size={13} />,
  waterfall: <Workflow size={13} />,
  action: <Zap size={13} />,
  signal: <Zap size={13} />,
};

export function HeaderCell({
  column,
  index,
  count,
  frozen,
  style,
  onOpenConfig,
  onRename,
  onMove,
  onDelete,
  onResizeStart,
}: {
  column: Column;
  index: number;
  count: number;
  frozen?: boolean;
  style?: React.CSSProperties;
  onOpenConfig: () => void;
  onRename: (name: string) => void;
  onMove: (toIndex: number) => void;
  onDelete: () => void;
  onResizeStart: (e: React.PointerEvent) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(column.name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  const commit = () => {
    const next = value.trim();
    if (next && next !== column.name) onRename(next);
    else setValue(column.name);
    setEditing(false);
  };

  return (
    <div
      style={style}
      className={cn(
        "group/h relative flex h-full items-center border-b border-r border-border-strong bg-bg-subtle",
        frozen && "sticky z-10",
      )}
    >
      {editing ? (
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") commit();
            if (e.key === "Escape") {
              setValue(column.name);
              setEditing(false);
            }
          }}
          className="mx-1 h-6 flex-1 rounded border border-accent bg-bg px-1.5 text-[13px] text-text outline-none"
        />
      ) : (
        <button
          type="button"
          onClick={onOpenConfig}
          title={column.name}
          className="flex h-full flex-1 items-center gap-1.5 overflow-hidden px-2.5 text-left transition-colors duration-100 ease-out hover:bg-border/40"
        >
          <span className="shrink-0 text-text-faint">{TYPE_ICON[column.type]}</span>
          <span className="truncate text-[13px] font-medium text-text">
            {column.name}
          </span>
        </button>
      )}

      {!editing && (
        <Menu
          align="end"
          trigger={
            <button
              aria-label="Column options"
              className="mr-1 grid h-6 w-5 shrink-0 place-items-center rounded text-text-faint opacity-0 transition-opacity hover:bg-border/60 hover:text-text group-hover/h:opacity-100"
            >
              <ChevronDown size={14} />
            </button>
          }
        >
          <MenuItem icon={<Pencil size={14} />} onClick={() => setEditing(true)}>
            Rename
          </MenuItem>
          <MenuItem
            icon={<ArrowLeft size={14} />}
            disabled={index === 0}
            onClick={() => onMove(index - 1)}
          >
            Move left
          </MenuItem>
          <MenuItem
            icon={<ArrowRight size={14} />}
            disabled={index === count - 1}
            onClick={() => onMove(index + 1)}
          >
            Move right
          </MenuItem>
          <MenuSeparator />
          <MenuItem danger icon={<Trash2 size={14} />} onClick={onDelete}>
            Delete column
          </MenuItem>
        </Menu>
      )}

      {/* Resize handle */}
      <div
        onPointerDown={onResizeStart}
        className="absolute right-0 top-0 h-full w-1.5 cursor-col-resize touch-none hover:bg-accent/40"
      />
    </div>
  );
}
