"use client";

import { Sparkles } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { ChannelBadge } from "@/components/domain/channel-badge";
import { PriorityBadge } from "@/components/domain/priority-badge";
import { StatusBadge } from "@/components/domain/status-badge";
import { formatRelativeTime } from "@/lib/format";
import { referenceLabel } from "@/lib/ticket-format";
import type { TicketDetail } from "@/types";

// Ticket title block: reference + channel + AI-triage marker, the subject, and
// the current status/priority with the ticket's age.
export function TicketHeader({ ticket }: { ticket: TicketDetail }) {
  const locale = useLocale();
  const t = useTranslations("ticketDetail");

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span className="font-mono">{referenceLabel(ticket.reference)}</span>
        <span aria-hidden="true">·</span>
        <ChannelBadge channel={ticket.channel} />
        {ticket.aiTriaged && (
          <span className="inline-flex items-center gap-1 text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            {t("aiTriaged")}
          </span>
        )}
      </div>
      <h1 className="font-display text-xl font-bold text-foreground sm:text-2xl">
        {ticket.subject}
      </h1>
      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge status={ticket.status} />
        <PriorityBadge priority={ticket.priority} />
        <span className="text-xs text-muted-foreground">
          {t("openedRelative", { time: formatRelativeTime(ticket.createdAt, locale) })}
        </span>
      </div>
    </div>
  );
}
