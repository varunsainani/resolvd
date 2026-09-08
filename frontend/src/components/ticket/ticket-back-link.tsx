"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

// "Back to inbox" link at the top of the ticket detail view.
export function TicketBackLink() {
  const t = useTranslations("ticketDetail");
  return (
    <Link
      href="/inbox"
      className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
    >
      <ArrowLeft className="h-4 w-4" />
      {t("back")}
    </Link>
  );
}
