"use client";

import { BarChart3 } from "lucide-react";
import { useTranslations } from "next-intl";

import { EmptyState } from "@/components/ui/empty-state";

// Whole-page empty state for the analytics dashboard when there are no tickets
// yet, shown instead of a wall of zeroed tiles and blank charts.
export function AnalyticsEmpty() {
  const t = useTranslations("analytics");
  return <EmptyState icon={BarChart3} title={t("empty")} />;
}
