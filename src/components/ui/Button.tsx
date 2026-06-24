import { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ButtonProps {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  onClick?: () => void;
}

export default function Button({
  children,
  href,
  variant = "primary",
  className,
  onClick,
}: ButtonProps) {
  const baseStyles =
    "group relative inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]";

  const variants = {
    primary:
      "bg-foreground text-background hover:bg-foreground/90 shadow-[0_4px_20px_rgba(0,0,0,0.12)]",
    secondary:
      "bg-white text-foreground border border-border hover:border-foreground/30 hover:bg-accent",
    ghost: "text-foreground hover:bg-accent",
  };

  const classes = cn(baseStyles, variants[variant], className);

  if (href) {
    return (
      <Link href={href} className={classes} onClick={onClick}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} onClick={onClick}>
      {children}
    </button>
  );
}