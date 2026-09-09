"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { FormError } from "@/components/ui/form-error";
import { Input } from "@/components/ui/input";
import { useMutation } from "@/hooks";
import { publicApi } from "@/lib/api";
import type { PublicTicket } from "@/types";
import { PublicTicketCard } from "./public-ticket-card";

// Look up a ticket's status by reference number + email (no auth).
export function TrackForm() {
  const t = useTranslations("submit.track");
  const [reference, setReference] = useState("");
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<PublicTicket | null>(null);
  const [notFound, setNotFound] = useState(false);
  const lookup = useMutation((args: { reference: string; email: string }) =>
    publicApi.status(args.reference, args.email),
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setNotFound(false);
    setResult(null);
    const res = await lookup.mutate({
      reference: reference.trim().replace(/^#/, ""),
      email: email.trim(),
    });
    if (res) setResult(res.ticket);
    else setNotFound(true);
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display text-lg font-semibold text-foreground">{t("title")}</h2>
        <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label={t("reference")} htmlFor="tk-ref">
          <Input
            id="tk-ref"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            required
            placeholder={t("referencePlaceholder")}
          />
        </Field>
        <Field label={t("email")} htmlFor="tk-email">
          <Input
            id="tk-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder={t("emailPlaceholder")}
          />
        </Field>
        {notFound && <FormError message={t("notFound")} />}
        <Button type="submit" loading={lookup.loading}>
          {lookup.loading ? t("looking") : t("lookup")}
        </Button>
      </form>
      {result && <PublicTicketCard ticket={result} />}
    </div>
  );
}
