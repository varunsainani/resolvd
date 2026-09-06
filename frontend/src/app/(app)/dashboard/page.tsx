"use client";

import { useTranslations } from "next-intl";

import { useAuth } from "@/components/auth/auth-provider";
import { PageHeader } from "@/components/shell/page-header";
import { Card, CardContent, Skeleton } from "@/components/ui";

// Placeholder dashboard: confirms the shell renders end to end. The real KPI
// tiles, charts, and queues arrive in chunk 8.
export default function DashboardPage() {
  const t = useTranslations("nav");
  const { user } = useAuth();
  const firstName = user?.name.split(" ")[0];

  return (
    <>
      <PageHeader
        title={t("dashboard")}
        description={firstName ? `Welcome back, ${firstName}.` : undefined}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-5">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="mt-3 h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
