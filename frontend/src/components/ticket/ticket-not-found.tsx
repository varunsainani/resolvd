"use client";

import { FileQuestion } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { EmptyState } from "@/components/ui/empty-state";

// Shown when a ticket id doesn't resolve (removed, or a bad link).
export function TicketNotFound() {
  const t = useTranslations("ticketDetail.notFound");
  return (
    <EmptyState
      icon={FileQuestion}
      title={t("title")}
      description={t("body")}
      action={
        <Link
          href="/inbox"
          className="inline-flex h-9 items-center justify-center rounded-md border border-border px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          {t("cta")}
        </Link>
      }
    />
  );
}
