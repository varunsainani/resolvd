"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { FormError } from "@/components/ui/form-error";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import { useMutation } from "@/hooks";
import { cannedApi, type CannedBody } from "@/lib/api";
import type { CannedResponse } from "@/types";

// Create or edit a canned response macro.
export function CannedFormModal({
  open,
  onClose,
  canned,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  canned?: CannedResponse | null;
  onSaved: () => void;
}) {
  const t = useTranslations("canned.form");
  const { toast } = useToast();
  const editing = Boolean(canned);
  const [title, setTitle] = useState(canned?.title ?? "");
  const [category, setCategory] = useState(canned?.category ?? "");
  const [body, setBody] = useState(canned?.body ?? "");

  const save = useMutation((payload: CannedBody) =>
    editing ? cannedApi.update(canned!.id, payload) : cannedApi.create(payload),
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload: CannedBody = {
      title: title.trim(),
      body: body.trim(),
      category: category.trim() || undefined,
    };
    const res = await save.mutate(payload);
    if (res) {
      toast(editing ? t("saved") : t("created"));
      onSaved();
      onClose();
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={editing ? t("editTitle") : t("newTitle")}>
      <form onSubmit={onSubmit} className="max-h-[70vh] space-y-4 overflow-y-auto pr-0.5">
        <FormError message={save.error} />
        <Field label={t("title")} htmlFor="cr-title">
          <Input
            id="cr-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder={t("titlePlaceholder")}
          />
        </Field>
        <Field label={t("category")} htmlFor="cr-cat">
          <Input
            id="cr-cat"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder={t("categoryPlaceholder")}
          />
        </Field>
        <Field label={t("body")} htmlFor="cr-body">
          <Textarea
            id="cr-body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            rows={8}
            placeholder={t("bodyPlaceholder")}
          />
        </Field>
        <div className="flex justify-end">
          <Button type="submit" loading={save.loading}>
            {save.loading ? t("saving") : editing ? t("save") : t("create")}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
