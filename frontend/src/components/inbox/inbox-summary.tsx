"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

// The line above the list: a localized ticket count, with a Clear button that
// appears only when a filter or search is narrowing the results.
export function InboxSummary({
  total,
  active,
  onClear,
}: {
  total: number;
  active: boolean;
  onClear: () => void;
}) {
  const t = useTranslations("inbox");
  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-muted-foreground">{t("count", { count: total })}</p>
      {active && (
        <Button variant="ghost" size="sm" onClick={onClear}>
          {t("clearFilters")}
        </Button>
      )}
    </div>
  );
}
