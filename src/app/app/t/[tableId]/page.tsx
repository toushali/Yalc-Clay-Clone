"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { Spinner } from "@/components/ui";
import { Grid } from "@/components/grid";

/**
 * Table view. Loads the table into the store (so the top bar shows its name)
 * and renders the canvas. The virtualized grid replaces the placeholder in S6.
 */
export default function TablePage({
  params,
}: {
  params: Promise<{ tableId: string }>;
}) {
  const { tableId } = use(params);
  const router = useRouter();
  const hydrated = useAppStore((s) => s.hydrated);
  const currentTable = useAppStore((s) => s.currentTable);
  const loadTable = useAppStore((s) => s.loadTable);
  const [status, setStatus] = useState<"loading" | "ready" | "missing">("loading");

  useEffect(() => {
    if (!hydrated) return;
    let cancelled = false;
    setStatus("loading");
    (async () => {
      await loadTable(tableId);
      if (cancelled) return;
      const t = useAppStore.getState().currentTable;
      setStatus(t && t.id === tableId ? "ready" : "missing");
    })();
    return () => {
      cancelled = true;
    };
  }, [hydrated, tableId, loadTable]);

  if (status === "missing") {
    return (
      <div className="grid h-full place-items-center p-8 text-center">
        <div>
          <p className="text-sm font-semibold text-text">Table not found</p>
          <button
            onClick={() => router.replace("/app")}
            className="mt-2 text-sm text-accent hover:underline"
          >
            Back to workspace
          </button>
        </div>
      </div>
    );
  }

  if (status === "loading" || currentTable?.id !== tableId) {
    return (
      <div className="grid h-full place-items-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return <Grid columns={currentTable.columns} rows={currentTable.rows} />;
}
