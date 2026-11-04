import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center self-start rounded-[var(--radius-pill)] px-2.5 py-1 text-[length:var(--text-sm)] font-bold leading-none",
  {
    variants: {
      variant: {
        default: "bg-[var(--color-ribbon-fill)] text-[var(--color-on-ribbon)]",
        outline:
          "border border-solid border-[var(--color-line)] bg-[var(--color-surface-2)] text-[var(--color-ink)]",
        caution:
          "border border-solid border-[var(--color-ribbon)] bg-transparent text-[var(--color-ribbon-text)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export type BadgeProps = React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span data-slot="badge" className={cn(badgeVariants({ variant, className }))} {...props} />
  );
}

export { badgeVariants };
