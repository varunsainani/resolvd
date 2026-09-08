"use client";

import { Clock, Timer, type LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDuration } from "@/lib/format";

function Metric({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className="h-4 w-4" />
        {label}
      </span>
      <span className="text-sm font-medium tabular-nums text-foreground">{value}</span>
    </div>
  );
}

// Average first-response and resolution times, shown as a dash when there is no
// qualifying data rather than a misleading zero.
export function ResponseTimesCard({
  avgFirstResponseMinutes,
  avgResolutionMinutes,
}: {
  avgFirstResponseMinutes: number | null;
  avgResolutionMinutes: number | null;
}) {
  const t = useTranslations("analytics");
  const fmt = (minutes: number | null) =>
    minutes === null ? t("notAvailable") : formatDuration(minutes);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">{t("responseTimes")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Metric icon={Clock} label={t("avgFirstResponse")} value={fmt(avgFirstResponseMinutes)} />
        <Metric icon={Timer} label={t("avgResolution")} value={fmt(avgResolutionMinutes)} />
      </CardContent>
    </Card>
  );
}
