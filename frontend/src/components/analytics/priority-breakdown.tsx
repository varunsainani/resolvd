"use client";

import { useTranslations } from "next-intl";

import type { BarItem } from "@/components/charts";
import { breakdownColor } from "@/lib/breakdown-colors";
import type { CountEntry } from "@/types";
import { BreakdownCard } from "./breakdown-card";

// Tickets by priority, colored on the same escalating scale as the badges.
export function PriorityBreakdown({ data }: { data: CountEntry[] }) {
  const t = useTranslations("analytics");
  const tPriority = useTranslations("ticket.priority");
  const items: BarItem[] = data.map((entry) => ({
    key: entry.key,
    label: tPriority(entry.key),
    value: entry.count,
    colorClass: breakdownColor("priority", entry.key),
  }));
  return <BreakdownCard title={t("byPriority")} items={items} />;
}
