"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronsLeft, ChevronsRight, Plus, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import type { TableSummary } from "@/lib/types";
import { ConfirmDialog, IconButton } from "@/components/ui";
import { NewTableModal } from "@/components/modals/NewTableModal";
import { SidebarTableItem } from "./SidebarTableItem";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const workspace = useAppStore((s) => s.workspace);
  const tables = useAppStore((s) => s.tables);
  const duplicateTable = useAppStore((s) => s.duplicateTable);
  const deleteTable = useAppStore((s) => s.deleteTable);

  const [collapsed, setCollapsed] = useState(false);
  const [newOpen, setNewOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<TableSummary | null>(null);

  const handleDuplicate = async (id: string) => {
    const newId = await duplicateTable(id);
    if (newId) router.push(`/app/t/${newId}`);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const wasActive = pathname === `/app/t/${deleteTarget.id}`;
    await deleteTable(deleteTarget.id);
    if (wasActive) {
      const next = useAppStore.getState().tables[0];
      router.replace(next ? `/app/t/${next.id}` : "/app");
    }
    setDeleteTarget(null);
  };

  return (
    <>
      <aside
        style={{ width: collapsed ? 56 : "var(--spacing-sidebar)" }}
        className="flex h-full shrink-0 flex-col border-r border-border bg-bg-subtle transition-[width] duration-200 ease-out"
      >
        {/* Workspace header */}
        <div className="flex h-topbar shrink-0 items-center justify-between gap-2 border-b border-border px-3">
          {!collapsed && (
            <span className="truncate text-sm font-semibold text-text">
              {workspace?.name ?? "Workspace"}
            </span>
          )}
          <IconButton
            label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            size="sm"
            onClick={() => setCollapsed((v) => !v)}
            className={cn(collapsed && "mx-auto")}
          >
            {collapsed ? <ChevronsRight size={16} /> : <ChevronsLeft size={16} />}
          </IconButton>
        </div>

        {/* Table list */}
        <nav className="flex-1 overflow-y-auto p-2">
          {!collapsed && (
            <p className="px-2 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wide text-text-faint">
              Tables
            </p>
          )}
          <ul className="space-y-0.5">
            {tables.map((t) => (
              <SidebarTableItem
                key={t.id}
                table={t}
                active={pathname === `/app/t/${t.id}`}
                collapsed={collapsed}
                onDuplicate={handleDuplicate}
                onDelete={setDeleteTarget}
              />
            ))}
          </ul>

          <button
            onClick={() => setNewOpen(true)}
            className={cn(
              "mt-1 flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-text-muted",
              "transition-colors duration-100 ease-out hover:bg-border/60 hover:text-text",
              collapsed && "justify-center",
            )}
          >
            <Plus size={16} className="shrink-0" />
            {!collapsed && "New table"}
          </button>
        </nav>

        {/* Settings */}
        <div className="shrink-0 border-t border-border p-2">
          <Link
            href="/app/settings"
            className={cn(
              "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-text-muted",
              "transition-colors duration-100 ease-out hover:bg-border/60 hover:text-text",
              collapsed && "justify-center",
            )}
          >
            <Settings size={16} className="shrink-0" />
            {!collapsed && "Settings"}
          </Link>
        </div>
      </aside>

      <NewTableModal
        open={newOpen}
        onClose={() => setNewOpen(false)}
        onCreated={(id) => router.push(`/app/t/${id}`)}
      />

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete table"
        description={
          deleteTarget ? (
            <>
              Delete <span className="font-medium text-text">{deleteTarget.name}</span> and
              all its rows? This can&apos;t be undone.
            </>
          ) : null
        }
        confirmLabel="Delete"
        danger
        onConfirm={confirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </>
  );
}
