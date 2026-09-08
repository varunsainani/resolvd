"use client";

import { Inbox, SearchX } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

// Empty inbox. When filters are active it offers a one-click clear; otherwise it
// reassures that the queue is genuinely clear.
export function InboxEmpty({ filtered, onClear }: { filtered: boolean; onClear: () => void }) {
  const t = useTranslations("inbox");

  if (filtered) {
    return (
      <EmptyState
        icon={SearchX}
        title={t("emptyFiltered.title")}
        description={t("emptyFiltered.body")}
        action={
          <Button variant="outline" onClick={onClear}>
            {t("clearFilters")}
          </Button>
        }
      />
    );
  }

  return <EmptyState icon={Inbox} title={t("empty.title")} description={t("empty.body")} />;
}
