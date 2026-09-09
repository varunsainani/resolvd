"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import type { CustomerSummary } from "@/types";

const CUSTOMER_COLOR = "#64748b";

// The customer directory as a table. Rows navigate to the customer detail page.
export function CustomerTable({ customers }: { customers: CustomerSummary[] }) {
  const t = useTranslations("customers");
  const router = useRouter();

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <Table>
        <THead>
          <TR className="hover:bg-transparent">
            <TH>{t("name")}</TH>
            <TH className="hidden sm:table-cell">{t("company")}</TH>
            <TH className="text-right">{t("tickets")}</TH>
          </TR>
        </THead>
        <TBody>
          {customers.map((customer) => (
            <TR
              key={customer.id}
              onClick={() => router.push(`/customers/${customer.id}`)}
              className="cursor-pointer"
            >
              <TD>
                <div className="flex items-center gap-3">
                  <Avatar name={customer.name} color={CUSTOMER_COLOR} size="sm" />
                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground">{customer.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{customer.email}</p>
                  </div>
                </div>
              </TD>
              <TD className="hidden text-muted-foreground sm:table-cell">
                {customer.company ?? t("noCompany")}
              </TD>
              <TD className="text-right">
                <Badge tone="neutral">{customer.ticketCount}</Badge>
              </TD>
            </TR>
          ))}
        </TBody>
      </Table>
    </div>
  );
}
