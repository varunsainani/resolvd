"use client";

import { Lock } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { FormError } from "@/components/ui/form-error";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import { TICKET_STATUSES, type SuggestResult, type TicketStatus } from "@/types";
import { SuggestButton } from "./suggest-button";
import { useTicketActions } from "./ticket-context";

// Reply/note composer. Toggles an internal note, optionally moves the ticket to
// a new status on send, and can pull an AI draft into the textarea first.
export function ReplyComposer() {
  const t = useTranslations("ticketDetail.compose");
  const tSuggest = useTranslations("ticketDetail.suggest");
  const tStatus = useTranslations("ticket.status");
  const tCommon = useTranslations("common");
  const { reply } = useTicketActions();
  const { toast } = useToast();

  const [body, setBody] = useState("");
  const [internal, setInternal] = useState(false);
  const [statusAfter, setStatusAfter] = useState<TicketStatus | "">("");
  const [sending, setSending] = useState(false);
  const [sources, setSources] = useState<SuggestResult["usedArticles"] | null>(null);
  const [error, setError] = useState<string | null>(null);

  function onSuggestion(result: SuggestResult) {
    setBody(result.reply);
    setSources(result.usedArticles);
  }

  async function onSend() {
    const text = body.trim();
    if (!text) {
      setError(t("empty"));
      return;
    }
    setSending(true);
    setError(null);
    const ok = await reply({ body: text, isInternal: internal, status: statusAfter || undefined });
    setSending(false);
    if (!ok) {
      toast(tCommon("error"), "error");
      return;
    }
    setBody("");
    setSources(null);
    setStatusAfter("");
    toast(internal ? t("noteAdded") : t("sent"));
  }

  return (
    <div className="space-y-3 rounded-lg border border-border bg-card p-4">
      <FormError message={error} />

      {sources && (
        <p className="text-xs text-muted-foreground">
          {tSuggest("sources")}:{" "}
          {sources.length > 0 ? sources.map((a) => a.title).join(", ") : tSuggest("noSources")}
        </p>
      )}

      <Textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder={t("placeholder")}
        rows={5}
        aria-label={t("reply")}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={internal}
              onChange={(e) => setInternal(e.target.checked)}
              className="h-4 w-4 rounded border-input accent-primary"
            />
            {t("internalToggle")}
          </label>
          <Select
            aria-label={t("statusAfter")}
            value={statusAfter}
            onChange={(e) => setStatusAfter(e.target.value as TicketStatus | "")}
            className="w-auto"
          >
            <option value="">{t("statusKeep")}</option>
            {TICKET_STATUSES.map((status) => (
              <option key={status} value={status}>
                {tStatus(status)}
              </option>
            ))}
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <SuggestButton onSuggestion={onSuggestion} disabled={sending} />
          <Button onClick={onSend} loading={sending}>
            {sending ? t("sending") : internal ? t("sendNote") : t("send")}
          </Button>
        </div>
      </div>

      {internal && (
        <p className="flex items-center gap-1 text-xs text-muted-foreground">
          <Lock className="h-3 w-3" />
          {t("internalHint")}
        </p>
      )}
    </div>
  );
}
