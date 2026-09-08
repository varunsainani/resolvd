"use client";

import { BarChart3, Plus } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { KpiGrid, TrendCard } from "@/components/analytics";
import { useAuth } from "@/components/auth/auth-provider";
import { NewTicketModal } from "@/components/inbox";
import { PageHeader } from "@/components/shell/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ErrorState } from "@/components/ui/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useApi, useDisclosure } from "@/hooks";
import { analyticsApi } from "@/lib/api";
import { TicketMiniList } from "./ticket-mini-list";

// The authenticated home: a greeting, the headline KPIs + volume trend, and two
// mini queues (recent tickets and the current agent's assigned tickets).
export function DashboardView() {
  const t = useTranslations("dashboard");
  const tCommon = useTranslations("common");
  const tInbox = useTranslations("inbox");
  const { user } = useAuth();
  const firstName = user?.name.split(" ")[0];
  const { data, loading, error, refetch } = useApi(() => analyticsApi.overview(), []);
  const newTicket = useDisclosure();

  return (
    <>
      <PageHeader
        title={firstName ? t("welcome", { name: firstName }) : t("welcomeGeneric")}
        description={t("subtitle")}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/analytics"
              className="inline-flex h-9 items-center gap-2 rounded-md border border-border px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              <BarChart3 className="h-4 w-4" />
              {t("viewAnalytics")}
            </Link>
            <Button onClick={newTicket.onOpen}>
              <Plus className="h-4 w-4" />
              {tInbox("newTicket")}
            </Button>
          </div>
        }
      />

      <div className="space-y-6">
        {error ? (
          <ErrorState message={error} onRetry={refetch} retryLabel={tCommon("retry")} />
        ) : loading || !data ? (
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
        ) : (
          <>
            <KpiGrid data={data} />
            <TrendCard points={data.trend} />
          </>
        )}

        <div className="grid gap-4 lg:grid-cols-2">
          <TicketMiniList
            title={t("recent")}
            params={{ sort: "newest", pageSize: 5 }}
            emptyMessage={t("emptyRecent")}
            href="/inbox"
            linkLabel={t("viewInbox")}
          />
          <TicketMiniList
            title={t("myQueue")}
            params={{ assignee: "me", sort: "priority", pageSize: 5 }}
            emptyMessage={t("emptyMine")}
            href="/inbox?assignee=me"
            linkLabel={t("viewInbox")}
          />
        </div>
      </div>

      <NewTicketModal open={newTicket.open} onClose={newTicket.onClose} />
    </>
  );
}
