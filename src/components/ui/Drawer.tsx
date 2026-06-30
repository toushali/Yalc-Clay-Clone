"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Portal } from "./Portal";
import { IconButton } from "./IconButton";
import { useOverlay } from "./useOverlay";
import { usePresence } from "./usePresence";

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  /** Drawer width; defaults to the §5 config-drawer width (360px). */
  width?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function Drawer({
  open,
  onClose,
  title,
  width = "var(--spacing-drawer)",
  children,
  footer,
}: DrawerProps) {
  const { mounted, shown } = usePresence(open, 200);
  const panelRef = useOverlay(open, onClose);

  if (!mounted) return null;

  return (
    <Portal>
      <div className="fixed inset-0 z-40">
        <div
          className={cn(
            "absolute inset-0 bg-black/20 transition-opacity duration-200 ease-out",
            shown ? "opacity-100" : "opacity-0",
          )}
          onClick={onClose}
        />
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          tabIndex={-1}
          style={{ width }}
          className={cn(
            "absolute right-0 top-0 flex h-full max-w-[90vw] flex-col bg-bg shadow-xl",
            "border-l border-border outline-none",
            "transition-transform duration-200 ease-out",
            shown ? "translate-x-0" : "translate-x-full",
          )}
        >
          <header className="flex h-header shrink-0 items-center justify-between border-b border-border px-4">
            <h2 className="text-sm font-semibold text-text">{title}</h2>
            <IconButton label="Close" size="sm" onClick={onClose}>
              <X size={16} />
            </IconButton>
          </header>
          <div className="flex-1 overflow-y-auto p-4">{children}</div>
          {footer && (
            <footer className="flex shrink-0 items-center justify-end gap-2 border-t border-border px-4 py-3">
              {footer}
            </footer>
          )}
        </div>
      </div>
    </Portal>
  );
}
