"use client";

import { CheckCircle2, Inbox, Percent, Sparkles, Ticket, UserX } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { StatCard } from "@/components/ui/stat-card";
import { formatNumber } from "@/lib/format";
import type { AnalyticsOverview } from "@/types";

// The headline KPI tiles: volume, queue state, and the two AI/resolution rates.
export function KpiGrid({ data }: { data: AnalyticsOverview }) {
  const t = useTranslations("analytics");
  const locale = useLocale();
  const n = (value: number) => formatNumber(value, locale);
  const { totals } = data;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      <StatCard label={t("total")} value={n(totals.total)} icon={Ticket} />
      <StatCard label={t("open")} value={n(totals.open)} icon={Inbox} />
      <StatCard label={t("unassigned")} value={n(totals.unassigned)} icon={UserX} />
      <StatCard label={t("resolved")} value={n(totals.resolved)} icon={CheckCircle2} />
      <StatCard
        label={t("resolutionRate")}
        value={`${totals.resolutionRate}%`}
        icon={Percent}
        hint={`${n(totals.resolved)}/${n(totals.total)}`}
      />
      <StatCard label={t("aiTriaged")} value={`${totals.aiTriagedPercent}%`} icon={Sparkles} />
    </div>
  );
}
