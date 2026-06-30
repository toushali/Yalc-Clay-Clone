"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Play, User } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { useSession } from "@/lib/auth";
import { Button, IconButton, Menu, MenuItem, MenuSeparator, Pill } from "@/components/ui";

export function TopBar() {
  const router = useRouter();
  const { signOut } = useSession();
  const workspace = useAppStore((s) => s.workspace);
  const currentTable = useAppStore((s) => s.currentTable);
  const renameTable = useAppStore((s) => s.renameTable);

  const [name, setName] = useState(currentTable?.name ?? "");
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => setName(currentTable?.name ?? ""), [currentTable?.id, currentTable?.name]);

  const commitName = () => {
    if (currentTable && name.trim() && name.trim() !== currentTable.name) {
      renameTable(currentTable.id, name.trim());
    } else {
      setName(currentTable?.name ?? "");
    }
  };

  const lowCredits = (workspace?.creditBalance ?? 0) <= 100;

  return (
    <header className="flex h-topbar shrink-0 items-center justify-between gap-3 border-b border-border bg-bg px-3">
      {/* Editable table name */}
      <div className="min-w-0 flex-1">
        {currentTable ? (
          <input
            ref={inputRef}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={commitName}
            onKeyDown={(e) => {
              if (e.key === "Enter") inputRef.current?.blur();
              if (e.key === "Escape") {
                setName(currentTable.name);
                inputRef.current?.blur();
              }
            }}
            aria-label="Table name"
            className="w-full max-w-md truncate rounded-md border border-transparent bg-transparent px-2 py-1 text-sm font-semibold text-text hover:border-border focus-visible:border-accent focus-visible:outline-none"
          />
        ) : (
          <span className="px-2 text-sm font-semibold text-text-faint">Yalc</span>
        )}
      </div>

      {/* Run controls (wired in S11) + credit pill + avatar */}
      <div className="flex shrink-0 items-center gap-2">
        <Button size="sm" variant="secondary" disabled={!currentTable} title="Run (S11)">
          <Play size={14} /> Run
        </Button>

        <Pill tone={lowCredits ? "warning" : "accent"}>
          {(workspace?.creditBalance ?? 0).toLocaleString()} credits
        </Pill>

        <Menu
          align="end"
          trigger={
            <IconButton label="Account menu">
              <User size={16} />
            </IconButton>
          }
        >
          <div className="px-3 py-1.5 text-xs text-text-muted">
            {workspace?.members[0]?.email ?? "Signed in"}
          </div>
          <MenuSeparator />
          <MenuItem
            icon={<LogOut size={14} />}
            onClick={() => {
              signOut();
              router.replace("/login");
            }}
          >
            Sign out
          </MenuItem>
        </Menu>
      </div>
    </header>
  );
}
