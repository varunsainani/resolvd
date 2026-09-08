"use client";

import { useTranslations } from "next-intl";

import { Badge, type BadgeTone } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AnalyticsOverview } from "@/types";

function Row({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium tabular-nums text-foreground">{value}</span>
    </div>
  );
}

// SLA health: an overall breach-rate pill (green/amber/red) plus the raw
// first-response and resolution breach counts.
export function SlaCard({ sla }: { sla: AnalyticsOverview["sla"] }) {
  const t = useTranslations("analytics");
  const tone: BadgeTone =
    sla.breachPercent > 25 ? "danger" : sla.breachPercent > 10 ? "warning" : "success";

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">{t("slaHealth")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm text-muted-foreground">{t("breachRate")}</span>
          <Badge tone={tone}>{sla.breachPercent}%</Badge>
        </div>
        <Row label={t("firstResponseBreaches")} value={sla.firstResponseBreaches} />
        <Row label={t("resolutionBreaches")} value={sla.resolutionBreaches} />
      </CardContent>
    </Card>
  );
}
