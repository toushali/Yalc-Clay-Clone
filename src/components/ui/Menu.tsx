"use client";

import { cloneElement, isValidElement, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Align = "start" | "end";

export interface MenuProps {
  /** Clickable element that toggles the menu. */
  trigger: React.ReactElement;
  align?: Align;
  children: React.ReactNode;
}

export function Menu({ trigger, align = "start", children }: MenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const triggerEl = isValidElement(trigger)
    ? cloneElement(trigger as React.ReactElement<{ onClick?: () => void }>, {
        onClick: () => setOpen((v) => !v),
      })
    : trigger;

  return (
    <div ref={rootRef} className="relative inline-flex">
      {triggerEl}
      {open && (
        <div
          role="menu"
          onClick={() => setOpen(false)}
          className={cn(
            "absolute top-full z-50 mt-1 min-w-44 overflow-hidden rounded-md border border-border bg-bg py-1 shadow-lg",
            align === "end" ? "right-0" : "left-0",
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export interface MenuItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Render as a destructive (red) action. */
  danger?: boolean;
  icon?: React.ReactNode;
}

export function MenuItem({
  danger,
  icon,
  className,
  children,
  ...props
}: MenuItemProps) {
  return (
    <button
      role="menuitem"
      className={cn(
        "flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm",
        "transition-colors duration-100 ease-out hover:bg-bg-subtle",
        "disabled:pointer-events-none disabled:opacity-50",
        danger ? "text-[var(--color-status-error)]" : "text-text",
        className,
      )}
      {...props}
    >
      {icon && <span className="text-text-faint">{icon}</span>}
      {children}
    </button>
  );
}

export function MenuSeparator() {
  return <div className="my-1 h-px bg-border" role="separator" />;
}
