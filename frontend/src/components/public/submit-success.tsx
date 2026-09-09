"use client";

import { CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import type { PublicTicket } from "@/types";
import { PublicTicketCard } from "./public-ticket-card";

// Confirmation shown after a public submission: the triaged ticket plus a nudge
// to keep the reference for tracking.
export function SubmitSuccess({
  ticket,
  onReset,
}: {
  ticket: PublicTicket;
  onReset: () => void;
}) {
  const t = useTranslations("submit.success");
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-success-soft text-success">
          <CheckCircle2 className="h-5 w-5" />
        </span>
        <div>
          <h2 className="font-display text-lg font-bold text-foreground">{t("title")}</h2>
          <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>
      </div>
      <PublicTicketCard ticket={ticket} />
      <p className="text-xs text-muted-foreground">{t("trackHint")}</p>
      <Button variant="outline" onClick={onReset}>
        {t("another")}
      </Button>
    </div>
  );
}
