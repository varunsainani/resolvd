"use client";

import { useTranslations } from "next-intl";

import { Select } from "@/components/ui/select";
import { TICKET_STATUSES, type TicketStatus } from "@/types";
import { useTicketActions } from "./ticket-context";

// Status dropdown that PATCHes the ticket on change.
export function StatusControl() {
  const t = useTranslations("ticket.status");
  const { ticket, patch, patching } = useTicketActions();
  return (
    <Select
      aria-label={t(ticket.status)}
      value={ticket.status}
      disabled={patching}
      onChange={(e) => patch({ status: e.target.value as TicketStatus })}
    >
      {TICKET_STATUSES.map((status) => (
        <option key={status} value={status}>
          {t(status)}
        </option>
      ))}
    </Select>
  );
}
