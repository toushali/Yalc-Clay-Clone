import {
  AtSign,
  Hash,
  Link as LinkIcon,
  Sparkles,
  Type,
  Workflow,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ColumnType } from "@/lib/types";

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
  name,
  type,
  frozen,
  style,
  onClick,
}: {
  name: string;
  type: ColumnType;
  frozen?: boolean;
  style?: React.CSSProperties;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={style}
      title={name}
      className={cn(
        "flex h-full items-center gap-1.5 overflow-hidden border-b border-r border-border-strong bg-bg-subtle px-2.5 text-left",
        "transition-colors duration-100 ease-out hover:bg-border/50",
        frozen ? "sticky z-10" : "",
      )}
    >
      <span className="shrink-0 text-text-faint">{TYPE_ICON[type]}</span>
      <span className="truncate text-[13px] font-medium text-text">{name}</span>
    </button>
  );
}
