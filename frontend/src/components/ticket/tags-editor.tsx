"use client";

import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useTicketActions } from "./ticket-context";

// Curate the ticket's tags: removable chips plus an add-on-Enter input. Tag
// mutations return the updated ticket, so the chip list stays in sync.
export function TagsEditor() {
  const t = useTranslations("ticketDetail.tags");
  const { ticket, addTag, removeTag } = useTicketActions();
  const [value, setValue] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const name = value.trim();
    if (!name) return;
    await addTag(name);
    setValue("");
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">{t("title")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {ticket.tags.length === 0 ? (
          <p className="text-xs text-muted-foreground">{t("empty")}</p>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {ticket.tags.map((tag) => (
              <span
                key={tag.name}
                className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: tag.color }}
                  aria-hidden="true"
                />
                {tag.name}
                <button
                  type="button"
                  onClick={() => removeTag(tag.name)}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={`${t("title")}: ${tag.name}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
        <form onSubmit={submit}>
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={t("placeholder")}
            aria-label={t("add")}
          />
        </form>
      </CardContent>
    </Card>
  );
}
