"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { FormError } from "@/components/ui/form-error";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import { useMutation } from "@/hooks";
import { ticketsApi, type TicketCreateBody } from "@/lib/api";
import { CHANNELS, TICKET_PRIORITIES, type Channel, type TicketPriority } from "@/types";

interface FormState {
  subject: string;
  message: string;
  name: string;
  email: string;
  company: string;
  channel: Channel;
  priority: TicketPriority | "";
}

const EMPTY: FormState = {
  subject: "",
  message: "",
  name: "",
  email: "",
  company: "",
  channel: "EMAIL",
  priority: "",
};

// Create-a-ticket dialog. The opening message is AI-triaged server-side, so
// priority is optional here ("auto"). On success it routes into the new ticket.
export function NewTicketModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
}) {
  const t = useTranslations("inbox.new");
  const tStatus = useTranslations("ticket.priority");
  const tChannel = useTranslations("ticket.channel");
  const router = useRouter();
  const { toast } = useToast();
  const [form, setForm] = useState<FormState>(EMPTY);
  const create = useMutation((body: TicketCreateBody) => ticketsApi.create(body));

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const body: TicketCreateBody = {
      subject: form.subject.trim(),
      message: form.message.trim(),
      customer: {
        name: form.name.trim(),
        email: form.email.trim(),
        ...(form.company.trim() ? { company: form.company.trim() } : {}),
      },
      channel: form.channel,
      ...(form.priority ? { priority: form.priority } : {}),
    };

    const result = await create.mutate(body);
    if (!result) return;

    toast(t("created"));
    setForm(EMPTY);
    onCreated?.();
    onClose();
    router.push(`/inbox/${result.ticket.id}`);
  }

  return (
    <Modal open={open} onClose={onClose} title={t("title")}>
      <form onSubmit={onSubmit} className="max-h-[70vh] space-y-4 overflow-y-auto pr-0.5">
        <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
        <FormError message={create.error} />

        <Field label={t("subject")} htmlFor="nt-subject">
          <Input
            id="nt-subject"
            required
            value={form.subject}
            onChange={(e) => set("subject", e.target.value)}
            placeholder={t("subjectPlaceholder")}
          />
        </Field>

        <Field label={t("message")} htmlFor="nt-message">
          <Textarea
            id="nt-message"
            required
            value={form.message}
            onChange={(e) => set("message", e.target.value)}
            placeholder={t("messagePlaceholder")}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t("customerName")} htmlFor="nt-name">
            <Input
              id="nt-name"
              required
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder={t("customerNamePlaceholder")}
            />
          </Field>
          <Field label={t("customerEmail")} htmlFor="nt-email">
            <Input
              id="nt-email"
              type="email"
              required
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder={t("customerEmailPlaceholder")}
            />
          </Field>
        </div>

        <Field label={t("company")} htmlFor="nt-company">
          <Input
            id="nt-company"
            value={form.company}
            onChange={(e) => set("company", e.target.value)}
            placeholder={t("companyPlaceholder")}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t("channel")} htmlFor="nt-channel">
            <Select
              id="nt-channel"
              value={form.channel}
              onChange={(e) => set("channel", e.target.value as Channel)}
            >
              {CHANNELS.map((channel) => (
                <option key={channel} value={channel}>
                  {tChannel(channel)}
                </option>
              ))}
            </Select>
          </Field>
          <Field label={t("priority")} htmlFor="nt-priority">
            <Select
              id="nt-priority"
              value={form.priority}
              onChange={(e) => set("priority", e.target.value as TicketPriority | "")}
            >
              <option value="">{t("priorityAuto")}</option>
              {TICKET_PRIORITIES.map((priority) => (
                <option key={priority} value={priority}>
                  {tStatus(priority)}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        <div className="flex justify-end pt-1">
          <Button type="submit" loading={create.loading}>
            {create.loading ? t("submitting") : t("submit")}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
