"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Table2 } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui";

/** Workspace landing: jump to the first table, or guide creating one (F1.3). */
export default function AppPage() {
  const router = useRouter();
  const hydrated = useAppStore((s) => s.hydrated);
  const tables = useAppStore((s) => s.tables);
  const createTable = useAppStore((s) => s.createTable);

  useEffect(() => {
    if (hydrated && tables.length > 0) {
      router.replace(`/app/t/${tables[0].id}`);
    }
  }, [hydrated, tables, router]);

  if (!hydrated || tables.length > 0) return null;

  return (
    <div className="grid h-full place-items-center p-8">
      <div className="max-w-sm text-center">
        <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-lg bg-bg-subtle text-text-faint">
          <Table2 size={22} />
        </div>
        <h2 className="text-base font-semibold text-text">No tables yet</h2>
        <p className="mt-1 text-sm text-text-muted">
          Create your first table to start building enrichment workflows.
        </p>
        <Button
          className="mt-4"
          onClick={async () => {
            const id = await createTable("custom");
            router.push(`/app/t/${id}`);
          }}
        >
          <Plus size={14} /> New table
        </Button>
      </div>
    </div>
  );
}
