"use client";

import { useState } from "react";
import { Building2, Table2, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import type { TableType } from "@/lib/types";
import { Button, Input, Modal } from "@/components/ui";

const OPTIONS: {
  type: TableType;
  label: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    type: "people",
    label: "People",
    description: "Track contacts — name, company, email.",
    icon: <Users size={18} />,
  },
  {
    type: "company",
    label: "Company",
    description: "Track accounts — company, domain.",
    icon: <Building2 size={18} />,
  },
  {
    type: "custom",
    label: "Blank",
    description: "Start from scratch with one column.",
    icon: <Table2 size={18} />,
  },
];

export function NewTableModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: (tableId: string) => void;
}) {
  const createTable = useAppStore((s) => s.createTable);
  const [type, setType] = useState<TableType>("people");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  const reset = () => {
    setType("people");
    setName("");
    setBusy(false);
  };

  const handleCreate = async () => {
    setBusy(true);
    const id = await createTable(type, name);
    reset();
    onClose();
    onCreated(id);
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        reset();
        onClose();
      }}
      title="New table"
      footer={
        <>
          <Button
            variant="ghost"
            onClick={() => {
              reset();
              onClose();
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleCreate} loading={busy}>
            Create table
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-2">
          {OPTIONS.map((opt) => (
            <button
              key={opt.type}
              type="button"
              onClick={() => setType(opt.type)}
              className={cn(
                "flex flex-col items-start gap-1.5 rounded-md border p-3 text-left transition-colors duration-150 ease-out",
                type === opt.type
                  ? "border-accent bg-accent/5 ring-1 ring-accent/30"
                  : "border-border hover:bg-bg-subtle",
              )}
            >
              <span
                className={cn(
                  type === opt.type ? "text-accent" : "text-text-muted",
                )}
              >
                {opt.icon}
              </span>
              <span className="text-sm font-medium text-text">{opt.label}</span>
              <span className="text-xs text-text-muted">{opt.description}</span>
            </button>
          ))}
        </div>

        <div className="space-y-1">
          <label htmlFor="table-name" className="text-xs font-medium text-text-muted">
            Name <span className="text-text-faint">(optional)</span>
          </label>
          <Input
            id="table-name"
            placeholder="e.g. Q3 Inbound Leads"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreate();
            }}
          />
        </div>
      </div>
    </Modal>
  );
}
