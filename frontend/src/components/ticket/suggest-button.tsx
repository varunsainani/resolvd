"use client";

import { Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import type { SuggestResult } from "@/types";
import { useTicketActions } from "./ticket-context";

// Requests a KB-grounded draft reply and hands it back to the composer. Kept
// separate so the suggest call and its loading/toast live in one place.
export function SuggestButton({
  onSuggestion,
  disabled,
}: {
  onSuggestion: (result: SuggestResult) => void;
  disabled?: boolean;
}) {
  const t = useTranslations("ticketDetail.suggest");
  const { suggest } = useTicketActions();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  async function run() {
    setLoading(true);
    const result = await suggest();
    setLoading(false);
    if (result) {
      onSuggestion(result);
      toast(t("applied"), "info");
    } else {
      toast(t("error"), "error");
    }
  }

  return (
    <Button type="button" variant="outline" onClick={run} loading={loading} disabled={disabled}>
      <Sparkles className="h-4 w-4" />
      {loading ? t("loading") : t("button")}
    </Button>
  );
}
