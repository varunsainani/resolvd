"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { useTicketActions } from "./ticket-context";

// Free-text category, committed on blur or Enter and only when it actually
// changed so idle focus churn never fires a request.
export function CategoryControl() {
  const t = useTranslations("ticketDetail.properties");
  const { ticket, patch, patching } = useTicketActions();
  const [value, setValue] = useState(ticket.category);

  useEffect(() => {
    setValue(ticket.category);
  }, [ticket.category]);

  function commit() {
    const next = value.trim();
    if (next && next !== ticket.category) patch({ category: next });
    else setValue(ticket.category);
  }

  return (
    <Input
      value={value}
      disabled={patching}
      onChange={(e) => setValue(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          (e.target as HTMLInputElement).blur();
        }
      }}
      placeholder={t("categoryPlaceholder")}
    />
  );
}
