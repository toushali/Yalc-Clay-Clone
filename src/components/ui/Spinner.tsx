import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const sizes = { sm: 14, md: 16, lg: 20 } as const;

export function Spinner({
  size = "md",
  className,
}: {
  size?: keyof typeof sizes;
  className?: string;
}) {
  return (
    <Loader2
      size={sizes[size]}
      className={cn("animate-spin text-text-muted", className)}
      aria-hidden
    />
  );
}
