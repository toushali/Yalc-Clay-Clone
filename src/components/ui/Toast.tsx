"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Portal } from "./Portal";

type ToastTone = "neutral" | "success" | "error";

interface ToastItem {
  id: number;
  tone: ToastTone;
  title: string;
  description?: string;
}

interface ToastInput {
  tone?: ToastTone;
  title: string;
  description?: string;
  /** ms before auto-dismiss; 0 to persist. Default 4000. */
  duration?: number;
}

interface ToastApi {
  toast: (t: ToastInput) => number;
  dismiss: (id: number) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}

const toneStyles: Record<ToastTone, { ring: string; icon: React.ReactNode }> = {
  neutral: { ring: "border-border", icon: <Info size={16} className="text-text-muted" /> },
  success: {
    ring: "border-[var(--color-status-success)]/30",
    icon: <CheckCircle2 size={16} className="text-[var(--color-status-success)]" />,
  },
  error: {
    ring: "border-[var(--color-status-error)]/30",
    icon: <AlertCircle size={16} className="text-[var(--color-status-error)]" />,
  },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const idRef = useRef(0);

  const dismiss = useCallback((id: number) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    ({ tone = "neutral", title, description, duration = 4000 }: ToastInput) => {
      const id = ++idRef.current;
      setItems((prev) => [...prev, { id, tone, title, description }]);
      if (duration > 0) setTimeout(() => dismiss(id), duration);
      return id;
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      <Portal>
        <div className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-80 flex-col gap-2">
          {items.map((t) => (
            <div
              key={t.id}
              role="status"
              className={cn(
                "pointer-events-auto flex items-start gap-2.5 rounded-md border bg-bg p-3 shadow-lg",
                toneStyles[t.tone].ring,
              )}
            >
              <span className="mt-0.5 shrink-0">{toneStyles[t.tone].icon}</span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-text">{t.title}</p>
                {t.description && (
                  <p className="mt-0.5 text-xs text-text-muted">{t.description}</p>
                )}
              </div>
              <button
                aria-label="Dismiss"
                onClick={() => dismiss(t.id)}
                className="shrink-0 text-text-faint transition-colors hover:text-text"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      </Portal>
    </ToastContext.Provider>
  );
}
