"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Copy, MoreHorizontal, Pencil, Table2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import type { TableSummary } from "@/lib/types";
import { IconButton, Menu, MenuItem, MenuSeparator } from "@/components/ui";

export function SidebarTableItem({
  table,
  active,
  collapsed,
  onDuplicate,
  onDelete,
}: {
  table: TableSummary;
  active: boolean;
  collapsed: boolean;
  onDuplicate: (id: string) => void;
  onDelete: (table: TableSummary) => void;
}) {
  const renameTable = useAppStore((s) => s.renameTable);
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(table.name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  const commit = () => {
    const next = value.trim();
    if (next && next !== table.name) renameTable(table.id, next);
    else setValue(table.name);
    setEditing(false);
  };

  if (editing && !collapsed) {
    return (
      <li>
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") commit();
            if (e.key === "Escape") {
              setValue(table.name);
              setEditing(false);
            }
          }}
          className="w-full rounded-md border border-accent bg-bg px-2 py-1.5 text-sm text-text focus-visible:outline-none"
        />
      </li>
    );
  }

  return (
    <li className="group relative">
      <Link
        href={`/app/t/${table.id}`}
        title={table.name}
        className={cn(
          "flex items-center gap-2 rounded-md py-1.5 pl-2 pr-8 text-sm transition-colors duration-100 ease-out",
          active
            ? "bg-accent/10 font-medium text-accent"
            : "text-text hover:bg-border/60",
          collapsed && "justify-center pr-2",
        )}
      >
        <Table2 size={16} className="shrink-0" />
        {!collapsed && <span className="truncate">{table.name}</span>}
      </Link>

      {!collapsed && (
        <div className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100">
          <Menu
            align="end"
            trigger={
              <IconButton label="Table options" size="sm" className="h-6 w-6">
                <MoreHorizontal size={15} />
              </IconButton>
            }
          >
            <MenuItem icon={<Pencil size={14} />} onClick={() => setEditing(true)}>
              Rename
            </MenuItem>
            <MenuItem icon={<Copy size={14} />} onClick={() => onDuplicate(table.id)}>
              Duplicate
            </MenuItem>
            <MenuSeparator />
            <MenuItem
              danger
              icon={<Trash2 size={14} />}
              onClick={() => onDelete(table)}
            >
              Delete
            </MenuItem>
          </Menu>
        </div>
      )}
    </li>
  );
}
