"use client";

import { useLocale, useTranslations } from "next-intl";

import { Avatar } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/format";
import { useTicketActions } from "./ticket-context";

const CUSTOMER_COLOR = "#64748b";

// The requester: name, company, a mailto link, and how long they've been a
// customer.
export function CustomerPanel() {
  const t = useTranslations("ticketDetail.customer");
  const locale = useLocale();
  const { ticket } = useTicketActions();
  const customer = ticket.customer;
  if (!customer) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">{t("title")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-3">
          <Avatar name={customer.name} color={CUSTOMER_COLOR} />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">{customer.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {customer.company ?? t("noCompany")}
            </p>
          </div>
        </div>
        <a
          href={`mailto:${customer.email}`}
          className="block truncate text-sm text-primary hover:underline"
        >
          {customer.email}
        </a>
        <p className="text-xs text-muted-foreground">
          {t("since", { date: formatDate(customer.createdAt, locale) })}
        </p>
      </CardContent>
    </Card>
  );
}
