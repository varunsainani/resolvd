"use client";

import { useTranslations } from "next-intl";

import { Badge, type BadgeTone } from "@/components/ui/badge";
import type { TicketStatus } from "@/types";

const TONE: Record<TicketStatus, BadgeTone> = {
  OPEN: "info",
  PENDING: "warning",
  RESOLVED: "success",
  CLOSED: "neutral",
};

// Ticket status pill with a localized label and a status-coded color.
export function StatusBadge({ status }: { status: TicketStatus }) {
  const t = useTranslations("ticket.status");
  return <Badge tone={TONE[status]}>{t(status)}</Badge>;
}
