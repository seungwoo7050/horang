"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

export function Tabs({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-3", className)}
      {...props}
    />
  );
}

export function TabsList({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "grid grid-flow-col auto-cols-fr gap-1 rounded-[var(--radius-pill)] bg-[var(--color-surface-2)] p-1",
        className,
      )}
      {...props}
    />
  );
}

export function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "min-h-[var(--hit-min)] rounded-[var(--radius-pill)] border-0 bg-transparent px-3 py-2 text-[length:var(--text-sm)] font-semibold text-[var(--color-muted)] cursor-pointer transition-colors data-[state=active]:bg-[var(--color-raised)] data-[state=active]:font-bold data-[state=active]:text-[var(--color-ink)] data-[state=active]:[box-shadow:var(--edge)] forced-colors:data-[state=active]:border-2 forced-colors:data-[state=active]:border-solid forced-colors:data-[state=active]:border-[Highlight]",
        className,
      )}
      {...props}
    />
  );
}

export function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex flex-col gap-3 outline-none", className)}
      {...props}
    />
  );
}
