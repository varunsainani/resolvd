"use client";

import { useTranslations } from "next-intl";

import { Select } from "@/components/ui/select";
import { TICKET_PRIORITIES, type TicketPriority } from "@/types";
import { useTicketActions } from "./ticket-context";

// Priority dropdown that PATCHes the ticket (and re-derives its SLA clocks
// server-side) on change.
export function PriorityControl() {
  const t = useTranslations("ticket.priority");
  const { ticket, patch, patching } = useTicketActions();
  return (
    <Select
      aria-label={t(ticket.priority)}
      value={ticket.priority}
      disabled={patching}
      onChange={(e) => patch({ priority: e.target.value as TicketPriority })}
    >
      {TICKET_PRIORITIES.map((priority) => (
        <option key={priority} value={priority}>
          {t(priority)}
        </option>
      ))}
    </Select>
  );
}
