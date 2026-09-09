"use client";

import { Pencil, Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/format";
import type { KbArticle } from "@/types";

// One knowledge base article: title, a body excerpt, category, last-updated, and
// edit/delete actions.
export function KbCard({
  article,
  onEdit,
  onDelete,
}: {
  article: KbArticle;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const t = useTranslations("kb");
  const locale = useLocale();

  return (
    <Card>
      <CardContent className="space-y-2 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-medium text-foreground">{article.title}</h3>
          <div className="flex shrink-0 gap-1">
            <button
              type="button"
              onClick={onEdit}
              aria-label={t("edit")}
              className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onDelete}
              aria-label={t("delete")}
              className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-danger"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
        <p className="line-clamp-2 text-sm text-muted-foreground">{article.body}</p>
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {article.category && <Badge tone="primary">{article.category}</Badge>}
          <span className="text-xs text-muted-foreground">
            {t("updated", { date: formatDate(article.updatedAt, locale) })}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
