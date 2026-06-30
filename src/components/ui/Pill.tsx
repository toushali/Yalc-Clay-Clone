import { cn } from "@/lib/utils";

/**
 * Compact badge. `tone` covers the neutral/accent set plus every cell-status
 * color so the grid's status pills (S8) and the credit pill (S13) reuse this.
 */
export type PillTone =
  | "neutral"
  | "accent"
  | "success"
  | "error"
  | "warning"
  | "muted";

const tones: Record<PillTone, string> = {
  neutral: "bg-bg-subtle text-text border-border-strong",
  accent: "bg-accent/10 text-accent border-accent/20",
  success:
    "bg-[var(--color-status-success-bg)] text-[var(--color-status-success)] border-[var(--color-status-success)]/20",
  error:
    "bg-[var(--color-status-error-bg)] text-[var(--color-status-error)] border-[var(--color-status-error)]/20",
  warning:
    "bg-[var(--color-status-skipped-bg)] text-[var(--color-status-skipped)] border-[var(--color-status-skipped)]/20",
  muted: "bg-bg-subtle text-text-faint border-border",
};

const dotColors: Record<PillTone, string> = {
  neutral: "bg-text-faint",
  accent: "bg-accent",
  success: "bg-[var(--color-status-success)]",
  error: "bg-[var(--color-status-error)]",
  warning: "bg-[var(--color-status-skipped)]",
  muted: "bg-text-faint",
};

export interface PillProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: PillTone;
  /** Show a leading status dot. */
  dot?: boolean;
  /** Pulse the dot (e.g. a running cell). */
  pulse?: boolean;
}

export function Pill({
  tone = "neutral",
  dot,
  pulse,
  className,
  children,
  ...props
}: PillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5",
        "text-xs font-medium leading-none tabular-nums",
        tones[tone],
        className,
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            "h-1.5 w-1.5 shrink-0 rounded-full",
            dotColors[tone],
            pulse && "animate-status-pulse",
          )}
        />
      )}
      {children}
    </span>
  );
}
