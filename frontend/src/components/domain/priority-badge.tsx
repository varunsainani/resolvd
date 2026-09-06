"use client";

import { useTranslations } from "next-intl";

import { Badge, type BadgeTone } from "@/components/ui/badge";
import type { TicketPriority } from "@/types";

const TONE: Record<TicketPriority, BadgeTone> = {
  LOW: "neutral",
  NORMAL: "info",
  HIGH: "warning",
  URGENT: "danger",
};

// Priority pill with a localized label and an escalating color.
export function PriorityBadge({ priority }: { priority: TicketPriority }) {
  const t = useTranslations("ticket.priority");
  return <Badge tone={TONE[priority]}>{t(priority)}</Badge>;
}
