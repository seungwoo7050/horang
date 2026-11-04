import * as React from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.ComponentProps<"section">) {
  return (
    <section
      data-slot="card"
      className={cn(
        "flex flex-col gap-3 rounded-[var(--radius)] bg-[var(--color-surface)] p-4 text-[var(--color-ink)] [box-shadow:var(--edge)] forced-colors:border forced-colors:border-solid forced-colors:border-[CanvasText]",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: React.ComponentProps<"header">) {
  return (
    <header data-slot="card-header" className={cn("flex flex-col gap-1", className)} {...props} />
  );
}

export function CardTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return (
    <h2
      data-slot="card-title"
      className={cn("m-0 text-[length:var(--text-lg)] font-bold leading-snug", className)}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="card-content" className={cn("flex flex-col gap-3", className)} {...props} />
  );
}
