"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { FormError } from "@/components/ui/form-error";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@/hooks";
import { publicApi, type PublicSubmitBody } from "@/lib/api";
import type { PublicTicket } from "@/types";

// Public intake form. Submits without auth; the server AI-triages the opening
// message and returns the trimmed ticket view.
export function SubmitForm({ onSuccess }: { onSuccess: (ticket: PublicTicket) => void }) {
  const t = useTranslations("submit.form");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const submit = useMutation((body: PublicSubmitBody) => publicApi.submit(body));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await submit.mutate({
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
      company: company.trim() || undefined,
    });
    if (res) onSuccess(res.ticket);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <FormError message={submit.error} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={t("name")} htmlFor="ps-name">
          <Input
            id="ps-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder={t("namePlaceholder")}
          />
        </Field>
        <Field label={t("email")} htmlFor="ps-email">
          <Input
            id="ps-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder={t("emailPlaceholder")}
          />
        </Field>
      </div>
      <Field label={t("company")} htmlFor="ps-company">
        <Input
          id="ps-company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder={t("companyPlaceholder")}
        />
      </Field>
      <Field label={t("subject")} htmlFor="ps-subject">
        <Input
          id="ps-subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
          placeholder={t("subjectPlaceholder")}
        />
      </Field>
      <Field label={t("message")} htmlFor="ps-message">
        <Textarea
          id="ps-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={6}
          placeholder={t("messagePlaceholder")}
        />
      </Field>
      <Button type="submit" loading={submit.loading} className="w-full">
        {submit.loading ? t("submitting") : t("submit")}
      </Button>
    </form>
  );
}
