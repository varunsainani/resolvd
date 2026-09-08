"use client";

import { useLocale, useTranslations } from "next-intl";

import { barPercent, hasData, maxCount } from "@/lib/chart";
import { formatDayLabel } from "@/lib/format";
import type { TrendPoint } from "@/types";
import { ChartEmpty } from "./chart-empty";

// Vertical bar chart of daily ticket volume. Each column is full-height and the
// bar inside is sized as a percentage of that column, so the height resolves
// against a definite reference (no flexbox height collapse).
export function TrendChart({ points }: { points: TrendPoint[] }) {
  const locale = useLocale();
  const t = useTranslations("analytics");

  if (!hasData(points)) return <ChartEmpty />;

  const max = maxCount(points.map((p) => ({ count: p.count })));
  const first = points[0];
  const last = points[points.length - 1];

  return (
    <div>
      <div className="flex h-40 items-end gap-1">
        {points.map((point) => (
          <div
            key={point.date}
            className="flex h-full flex-1 flex-col justify-end"
            title={t("trendPoint", { count: point.count, date: formatDayLabel(point.date, locale) })}
          >
            <div
              className="w-full rounded-t bg-primary/80 transition-[height]"
              style={{ height: `${barPercent(point.count, max)}%`, minHeight: point.count > 0 ? 3 : 0 }}
            />
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-between text-xs text-muted-foreground">
        <span>{formatDayLabel(first.date, locale)}</span>
        <span>{formatDayLabel(last.date, locale)}</span>
      </div>
    </div>
  );
}
