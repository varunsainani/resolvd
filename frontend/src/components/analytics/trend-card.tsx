"use client";

import { useTranslations } from "next-intl";

import { TrendChart } from "@/components/charts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { TrendPoint } from "@/types";

// The daily ticket-volume trend over the last 14 days.
export function TrendCard({ points }: { points: TrendPoint[] }) {
  const t = useTranslations("analytics");
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">{t("trend")}</CardTitle>
        <CardDescription className="text-xs">{t("trendSubtitle")}</CardDescription>
      </CardHeader>
      <CardContent>
        <TrendChart points={points} />
      </CardContent>
    </Card>
  );
}
