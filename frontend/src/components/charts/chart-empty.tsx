"use client";

import { useTranslations } from "next-intl";

// Placeholder shown in a chart card when there is no data to plot yet.
export function ChartEmpty() {
  const t = useTranslations("analytics");
  return <p className="py-8 text-center text-sm text-muted-foreground">{t("empty")}</p>;
}
