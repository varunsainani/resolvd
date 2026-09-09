"use client";

import { Sparkles } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { PriorityBadge } from "@/components/domain/priority-badge";
import { SentimentBadge } from "@/components/domain/sentiment-badge";
import { StatusBadge } from "@/components/domain/status-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/format";
import { referenceLabel } from "@/lib/ticket-format";
import type { PublicTicket } from "@/types";

function titleCase(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

// The trimmed, customer-facing view of a ticket: reference, subject, its triaged
// state, and the AI summary. Shared by the submit success and track results.
export function PublicTicketCard({ ticket }: { ticket: PublicTicket }) {
  const t = useTranslations("submit.success");
  const tTrack = useTranslations("submit.track");
  const locale = useLocale();

  return (
    <Card>
      <CardContent className="space-y-4 p-6">
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-sm text-muted-foreground">
            {referenceLabel(ticket.reference)}
          </span>
          <span className="text-xs text-muted-foreground">
            {tTrack("openedOn", { date: formatDate(ticket.createdAt, locale) })}
          </span>
        </div>
        <h3 className="font-display text-lg font-semibold text-foreground">{ticket.subject}</h3>
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={ticket.status} />
          <PriorityBadge priority={ticket.priority} />
          <SentimentBadge sentiment={ticket.sentiment} />
          {ticket.category && <Badge tone="neutral">{titleCase(ticket.category)}</Badge>}
        </div>
        {ticket.summary && (
          <div className="rounded-lg bg-muted p-3">
            <p className="mb-1 flex items-center gap-1.5 text-xs font-medium text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              {t("summary")}
            </p>
            <p className="text-sm text-muted-foreground">{ticket.summary}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
