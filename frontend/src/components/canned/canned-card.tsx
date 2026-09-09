"use client";

import { Check, Copy, Pencil, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import type { CannedResponse } from "@/types";

// One canned response: title, body, category, and copy/edit/delete actions. Copy
// puts the body on the clipboard so agents can paste it into a reply.
export function CannedCard({
  canned,
  onEdit,
  onDelete,
}: {
  canned: CannedResponse;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const t = useTranslations("canned");
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(canned.body);
      setCopied(true);
      toast(t("copied"));
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard can be unavailable (permissions, insecure context); ignore.
    }
  }

  return (
    <Card>
      <CardContent className="space-y-2 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-medium text-foreground">{canned.title}</h3>
          <div className="flex shrink-0 gap-1">
            <button
              type="button"
              onClick={copy}
              aria-label={t("copy")}
              className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
            </button>
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
        <p className="line-clamp-3 whitespace-pre-wrap text-sm text-muted-foreground">
          {canned.body}
        </p>
        {canned.category && (
          <div className="pt-1">
            <Badge tone="primary">{canned.category}</Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
