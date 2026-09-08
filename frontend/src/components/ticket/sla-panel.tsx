"use client";

import { useTranslations } from "next-intl";

import { SlaBadge } from "@/components/domain/sla-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTicketActions } from "./ticket-context";

// Both SLA clocks for the ticket: first response and resolution.
export function SlaPanel() {
  const t = useTranslations("ticketDetail.sla");
  const tSla = useTranslations("sla");
  const { ticket } = useTicketActions();

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">{t("title")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm text-muted-foreground">{tSla("firstResponse")}</span>
          <SlaBadge milestone={ticket.sla.firstResponse} />
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm text-muted-foreground">{tSla("resolution")}</span>
          <SlaBadge milestone={ticket.sla.resolution} />
        </div>
      </CardContent>
    </Card>
  );
}
