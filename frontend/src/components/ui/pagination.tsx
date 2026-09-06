"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/cn";
import { pageRange } from "@/lib/pagination";

// Page navigation. Hidden when there is only one page.
export function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;
  const tokens = pageRange(page, totalPages);

  const arrow = "inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-muted disabled:opacity-40 disabled:hover:bg-transparent";

  return (
    <nav className="flex items-center gap-1">
      <button className={arrow} disabled={page <= 1} onClick={() => onChange(page - 1)} aria-label="Previous page">
        <ChevronLeft className="h-4 w-4" />
      </button>
      {tokens.map((tok, i) =>
        tok === "ellipsis" ? (
          <span key={`e${i}`} className="px-2 text-muted-foreground">
            …
          </span>
        ) : (
          <button
            key={tok}
            onClick={() => onChange(tok)}
            aria-current={tok === page ? "page" : undefined}
            className={cn(
              "h-9 min-w-9 rounded-md px-3 text-sm font-medium",
              tok === page
                ? "bg-primary text-primary-foreground"
                : "text-foreground hover:bg-muted",
            )}
          >
            {tok}
          </button>
        ),
      )}
      <button className={arrow} disabled={page >= totalPages} onClick={() => onChange(page + 1)} aria-label="Next page">
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}
