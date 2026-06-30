"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Portal } from "./Portal";
import { IconButton } from "./IconButton";
import { useOverlay } from "./useOverlay";
import { usePresence } from "./usePresence";

type Size = "sm" | "md" | "lg";

const sizes: Record<Size, string> = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
};

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  size?: Size;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function Modal({
  open,
  onClose,
  title,
  size = "md",
  children,
  footer,
}: ModalProps) {
  const { mounted, shown } = usePresence(open, 200);
  const panelRef = useOverlay(open, onClose);

  if (!mounted) return null;

  return (
    <Portal>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className={cn(
            "absolute inset-0 bg-black/30 transition-opacity duration-200 ease-out",
            shown ? "opacity-100" : "opacity-0",
          )}
          onClick={onClose}
        />
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          tabIndex={-1}
          className={cn(
            "relative flex max-h-[85vh] w-full flex-col rounded-lg bg-bg shadow-xl outline-none",
            "border border-border",
            "transition-all duration-200 ease-out",
            shown ? "scale-100 opacity-100" : "scale-95 opacity-0",
            sizes[size],
          )}
        >
          <header className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3">
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
