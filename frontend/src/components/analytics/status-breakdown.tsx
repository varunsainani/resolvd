"use client";

import { useTranslations } from "next-intl";

import type { BarItem } from "@/components/charts";
import { breakdownColor } from "@/lib/breakdown-colors";
import type { CountEntry } from "@/types";
import { BreakdownCard } from "./breakdown-card";

// Tickets by status, colored to match the status badges.
export function StatusBreakdown({ data }: { data: CountEntry[] }) {
  const t = useTranslations("analytics");
  const tStatus = useTranslations("ticket.status");
  const items: BarItem[] = data.map((entry) => ({
    key: entry.key,
    label: tStatus(entry.key),
    value: entry.count,
    colorClass: breakdownColor("status", entry.key),
  }));
  return <BreakdownCard title={t("byStatus")} items={items} />;
}
