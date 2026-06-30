import { cn } from "@/lib/utils";
import type { Cell, CellValue, ColumnType } from "@/lib/types";

/** Read-only display formatting per column type. */
function formatValue(value: CellValue | undefined, type: ColumnType): string {
  if (value == null || value === "") return "";
  if (type === "number" && typeof value === "number") return value.toLocaleString();
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

export function GridCell({
  cell,
  type,
  frozen,
  style,
}: {
  cell: Cell | undefined;
  type: ColumnType;
  frozen?: boolean;
  style?: React.CSSProperties;
}) {
  const display = formatValue(cell?.value, type);
  const isLink = (type === "url" || type === "email") && display !== "";

  return (
    <div
      style={style}
      className={cn(
        "flex h-full items-center overflow-hidden border-b border-r border-border px-2.5 text-sm",
        "tabular-nums",
        frozen
          ? "sticky z-10 bg-bg group-hover:bg-bg-subtle"
          : "bg-transparent",
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
