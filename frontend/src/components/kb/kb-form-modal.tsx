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
import { kbApi, type KbBody } from "@/lib/api";
import type { KbArticle } from "@/types";

// Create or edit a knowledge base article. Mounted fresh on open (keyed by the
// parent), so the fields always reflect the article being edited.
export function KbFormModal({
  open,
  onClose,
  article,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  article?: KbArticle | null;
  onSaved: () => void;
}) {
  const t = useTranslations("kb.form");
  const { toast } = useToast();
  const editing = Boolean(article);
  const [title, setTitle] = useState(article?.title ?? "");
  const [category, setCategory] = useState(article?.category ?? "");
  const [keywords, setKeywords] = useState(article?.keywords ?? "");
  const [body, setBody] = useState(article?.body ?? "");

  const save = useMutation((payload: KbBody) =>
    editing ? kbApi.update(article!.id, payload) : kbApi.create(payload),
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload: KbBody = {
      title: title.trim(),
      body: body.trim(),
      category: category.trim() || undefined,
      keywords: keywords.trim() || undefined,
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
        <Field label={t("title")} htmlFor="kb-title">
          <Input
            id="kb-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder={t("titlePlaceholder")}
          />
        </Field>
        <Field label={t("category")} htmlFor="kb-cat">
          <Input
            id="kb-cat"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder={t("categoryPlaceholder")}
          />
        </Field>
        <Field label={t("keywords")} htmlFor="kb-kw" hint={t("keywordsHint")}>
          <Input
            id="kb-kw"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder={t("keywordsPlaceholder")}
          />
        </Field>
        <Field label={t("body")} htmlFor="kb-body">
          <Textarea
            id="kb-body"
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
