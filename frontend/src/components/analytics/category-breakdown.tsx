"use client";

import { useTranslations } from "next-intl";

import type { BarItem } from "@/components/charts";
import type { CountEntry } from "@/types";
import { BreakdownCard } from "./breakdown-card";

// Categories are free-form slugs from triage, so there is no fixed translation
// map; title-case the key for display.
function titleCase(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

// Tickets by category.
export function CategoryBreakdown({ data }: { data: CountEntry[] }) {
  const t = useTranslations("analytics");
  const items: BarItem[] = data.map((entry) => ({
    key: entry.key,
    label: titleCase(entry.key),
    value: entry.count,
  }));
  return <BreakdownCard title={t("byCategory")} items={items} />;
}
