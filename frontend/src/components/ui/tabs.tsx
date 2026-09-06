"use client";

import { cn } from "@/lib/cn";

export interface TabItem {
  value: string;
  label: string;
}

// Underline tab bar. Controlled: the parent owns the active value.
export function Tabs({
  tabs,
  value,
  onChange,
  className,
}: {
  tabs: TabItem[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex gap-1 border-b border-border", className)} role="tablist">
      {tabs.map((tab) => {
        const active = tab.value === value;
        return (
          <button
            key={tab.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.value)}
            className={cn(
              "relative px-4 py-2 text-sm font-medium transition-colors",
              active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
            {active && <span className="absolute inset-x-2 -bottom-px h-0.5 rounded bg-primary" />}
          </button>
        );
      })}
    </div>
  );
}
