"use client";

import Link from "next/link";
import { useLocale } from "next-intl";

import { ChannelBadge } from "@/components/domain/channel-badge";
import { PriorityBadge } from "@/components/domain/priority-badge";
import { SlaBadge } from "@/components/domain/sla-badge";
import { StatusBadge } from "@/components/domain/status-badge";
import { Avatar } from "@/components/ui/avatar";
import { formatRelativeTime } from "@/lib/format";
import { pickSla, referenceLabel } from "@/lib/ticket-format";
import type { TicketRow as TicketRowData } from "@/types";
import { TicketTags } from "./ticket-tags";

// One inbox row; the whole row links into the ticket. The left column carries
// identity (reference, channel, subject, customer, tags); the right column the
// state badges, most-urgent SLA, assignee, and age.
export function TicketRow({ ticket }: { ticket: TicketRowData }) {
  const locale = useLocale();

  return (
    <Link
      href={`/inbox/${ticket.id}`}
      className="flex flex-col gap-3 px-4 py-3.5 transition-colors hover:bg-muted/60 sm:flex-row sm:items-center sm:gap-4"
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-mono">{referenceLabel(ticket.reference)}</span>
          <span aria-hidden="true">·</span>
          <ChannelBadge channel={ticket.channel} />
        </div>
        <p className="mt-0.5 truncate font-medium text-foreground">{ticket.subject}</p>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">
          {ticket.customer?.name ?? "—"}
        </p>
        <div className="mt-2">
          <TicketTags tags={ticket.tags} />
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 sm:w-auto sm:flex-col sm:items-end sm:justify-center">
        <div className="flex flex-wrap items-center gap-1.5">
          <StatusBadge status={ticket.status} />
          <PriorityBadge priority={ticket.priority} />
        </div>
        <div className="flex items-center gap-2">
          <SlaBadge milestone={pickSla(ticket.sla)} />
          {ticket.assignee && (
            <Avatar name={ticket.assignee.name} color={ticket.assignee.avatarColor} size="sm" />
          )}
        </div>
        <span className="whitespace-nowrap text-xs text-muted-foreground">
          {formatRelativeTime(ticket.createdAt, locale)}
        </span>
      </div>
    </Link>
  );
}
