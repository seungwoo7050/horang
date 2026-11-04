import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-[var(--radius)] font-bold transition-transform duration-[var(--dur-tap)] ease-out active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 cursor-pointer border-0 text-center no-underline forced-colors:border forced-colors:border-solid forced-colors:border-[CanvasText]",
  {
    variants: {
      variant: {
        default: "bg-[var(--color-ribbon-fill)] text-[var(--color-on-ribbon)]",
        secondary: "bg-[var(--color-surface)] text-[var(--color-ink)] [box-shadow:var(--edge)]",
        outline:
          "border border-solid border-[var(--color-line)] bg-transparent text-[var(--color-ink)]",
        ghost: "bg-transparent text-[var(--color-ink)]",
      },
      size: {
        default: "min-h-[var(--hit-primary)] w-full px-4 py-3 text-[length:var(--text-base)]",
        sm: "min-h-[var(--hit-min)] px-3 py-2 text-[length:var(--text-sm)]",
        icon: "h-[var(--hit-min)] w-[var(--hit-min)] rounded-[var(--radius-pill)] p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { buttonVariants };
