"use client";

import { Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

import { SentimentBadge } from "@/components/domain/sentiment-badge";
import { Card, CardContent } from "@/components/ui/card";
import { useTicketActions } from "./ticket-context";

// The AI triage summary paired with the detected customer sentiment.
export function SummaryPanel() {
  const t = useTranslations("ticketDetail.summary");
  const { ticket } = useTicketActions();

  return (
    <Card>
      <CardContent className="space-y-2 p-5">
        <div className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
            <Sparkles className="h-4 w-4 text-primary" />
            {t("title")}
          </span>
          <SentimentBadge sentiment={ticket.sentiment} />
        </div>
        <p className="text-sm text-muted-foreground">{ticket.summary || t("empty")}</p>
      </CardContent>
    </Card>
  );
}
