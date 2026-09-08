"use client";

import { useTranslations } from "next-intl";

import type { BarItem } from "@/components/charts";
import { breakdownColor } from "@/lib/breakdown-colors";
import type { CountEntry } from "@/types";
import { BreakdownCard } from "./breakdown-card";

// Tickets by AI-detected customer sentiment.
export function SentimentBreakdown({ data }: { data: CountEntry[] }) {
  const t = useTranslations("analytics");
  const tSentiment = useTranslations("ticket.sentiment");
  const items: BarItem[] = data.map((entry) => ({
    key: entry.key,
    label: tSentiment(entry.key),
    value: entry.count,
    colorClass: breakdownColor("sentiment", entry.key),
  }));
  return <BreakdownCard title={t("bySentiment")} items={items} />;
}
