import type { TicketRow as TicketRowData } from "@/types";
import { TicketRow } from "./ticket-row";

// The inbox list: a bordered card of divider-separated rows.
export function TicketList({ tickets }: { tickets: TicketRowData[] }) {
  return (
    <div className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
      {tickets.map((ticket) => (
        <TicketRow key={ticket.id} ticket={ticket} />
      ))}
    </div>
  );
}
