"use client";

import { useTranslations } from "next-intl";

import {
  AnalyticsEmpty,
  BreakdownGrid,
  KpiGrid,
  ResponseTimesCard,
  SlaCard,
  TrendCard,
} from "@/components/analytics";
import { PageHeader } from "@/components/shell/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { ErrorState } from "@/components/ui/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useApi } from "@/hooks";
import { analyticsApi } from "@/lib/api";

function AnalyticsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-5">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="mt-3 h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Skeleton className="h-56 lg:col-span-2" />
        <Skeleton className="h-56" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-44" />
        ))}
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const t = useTranslations("analytics");
  const tCommon = useTranslations("common");
  const { data, loading, error, refetch } = useApi(() => analyticsApi.overview(), []);

  return (
    <>
      <PageHeader title={t("title")} description={t("subtitle")} />

      {error ? (
        <ErrorState message={error} onRetry={refetch} retryLabel={tCommon("retry")} />
      ) : loading || !data ? (
        <AnalyticsSkeleton />
      ) : data.totals.total === 0 ? (
        <AnalyticsEmpty />
      ) : (
        <div className="space-y-6">
          <KpiGrid data={data} />
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <TrendCard points={data.trend} />
            </div>
            <div className="space-y-4">
              <SlaCard sla={data.sla} />
              <ResponseTimesCard {...data.responseTimes} />
            </div>
          </div>
          <BreakdownGrid data={data} />
        </div>
      )}
    </>
  );
}
