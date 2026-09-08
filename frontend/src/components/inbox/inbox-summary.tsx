"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

// The line above the list: a localized ticket count, with a Clear button that
// appears only when a filter or search is narrowing the results. Shows a spinner
// while a re-filter is refetching so the (stale) list doesn't look frozen.
export function InboxSummary({
  total,
  active,
  loading = false,
  onClear,
}: {
  total: number;
  active: boolean;
  loading?: boolean;
  onClear: () => void;
}) {
  const t = useTranslations("inbox");
  return (
    <div className="flex items-center justify-between" aria-busy={loading}>
      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        {t("count", { count: total })}
        {loading && <Spinner className="h-3.5 w-3.5" />}
      </p>
      {active && (
        <Button variant="ghost" size="sm" onClick={onClear}>
          {t("clearFilters")}
        </Button>
      )}
    </div>
  );
}
