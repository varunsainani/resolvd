"use client";

import Link from "next/link";

import { TicketRow } from "@/components/inbox";
import { Card } from "@/components/ui/card";
import { ListSkeleton } from "@/components/ui/list-skeleton";
import { useApi } from "@/hooks";
import { ticketsApi, type TicketListParams } from "@/lib/api";

// A compact, self-fetching ticket list for the dashboard (recent tickets, or the
// current agent's queue) with its own loading and empty states and a link to the
// matching inbox view.
export function TicketMiniList({
  title,
  params,
  emptyMessage,
  href,
  linkLabel,
}: {
  title: string;
  params: TicketListParams;
  emptyMessage: string;
  href: string;
  linkLabel: string;
}) {
  const { data, loading } = useApi(() => ticketsApi.list(params), [JSON.stringify(params)]);
  const tickets = data?.data ?? [];

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <Link href={href} className="text-xs font-medium text-primary hover:underline">
          {linkLabel}
        </Link>
      </div>
      {loading && !data ? (
        <div className="p-4">
          <ListSkeleton rows={3} />
        </div>
      ) : tickets.length === 0 ? (
        <p className="px-4 py-8 text-center text-sm text-muted-foreground">{emptyMessage}</p>
      ) : (
        <div className="divide-y divide-border">
          {tickets.map((ticket) => (
            <TicketRow key={ticket.id} ticket={ticket} />
          ))}
        </div>
      )}
    </Card>
  );
}
