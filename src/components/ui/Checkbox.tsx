import { forwardRef } from "react";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  /** Visually indeterminate (e.g. partial select-all). */
  indeterminate?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ indeterminate, checked, className, ...props }, ref) => (
    <span className="relative inline-flex h-4 w-4 shrink-0">
      <input
        ref={ref}
        type="checkbox"
        checked={checked}
        className={cn(
          "peer h-4 w-4 cursor-pointer appearance-none rounded-[4px] border border-border-strong bg-bg",
          "transition-colors duration-150 ease-out",
          "checked:border-accent checked:bg-accent",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40",
          "disabled:cursor-not-allowed disabled:opacity-50",
          indeterminate && "border-accent bg-accent",
          className,
        )}
        {...props}
      />
      <span className="pointer-events-none absolute inset-0 hidden items-center justify-center text-white peer-checked:flex">
        {indeterminate ? <Minus size={12} strokeWidth={3} /> : <Check size={12} strokeWidth={3} />}
      </span>
      {indeterminate && !checked && (
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-white">
          <Minus size={12} strokeWidth={3} />
        </span>
      )}
    </span>
  ),
);
Checkbox.displayName = "Checkbox";
