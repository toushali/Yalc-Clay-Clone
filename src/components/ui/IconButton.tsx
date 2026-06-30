import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type Size = "sm" | "md";

const sizes: Record<Size, string> = {
  sm: "h-7 w-7",
  md: "h-8 w-8",
};

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Accessible label — icon buttons have no visible text. */
  label: string;
  size?: Size;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ label, size = "md", className, children, ...props }, ref) => (
    <button
      ref={ref}
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex items-center justify-center rounded-md text-text-muted",
        "transition-colors duration-150 ease-out hover:bg-bg-subtle hover:text-text",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40",
        "disabled:pointer-events-none disabled:opacity-50",
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  ),
);
IconButton.displayName = "IconButton";
