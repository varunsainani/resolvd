"use client";

import { useTranslations } from "next-intl";

import type { BarItem } from "@/components/charts";
import type { CountEntry } from "@/types";
import { BreakdownCard } from "./breakdown-card";

// Tickets by channel (email/chat/web/phone).
export function ChannelBreakdown({ data }: { data: CountEntry[] }) {
  const t = useTranslations("analytics");
  const tChannel = useTranslations("ticket.channel");
  const items: BarItem[] = data.map((entry) => ({
    key: entry.key,
    label: tChannel(entry.key),
    value: entry.count,
  }));
  return <BreakdownCard title={t("byChannel")} items={items} />;
}
