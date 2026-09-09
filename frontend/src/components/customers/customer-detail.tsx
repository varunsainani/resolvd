"use client";

import { ArrowLeft, Pencil } from "lucide-react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

import { TicketRow } from "@/components/inbox";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ErrorState } from "@/components/ui/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useApi, useDisclosure } from "@/hooks";
import { formatDate } from "@/lib/format";
import { customersApi } from "@/lib/api";
import type { Customer } from "@/types";
import { EditCustomerModal } from "./edit-customer-modal";

const CUSTOMER_COLOR = "#64748b";

function CustomerDetailSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-28 w-full" />
      <Skeleton className="h-40 w-full" />
    </div>
  );
}

// A customer profile with their full ticket history. Edits are applied to local
// state so the header updates without a refetch.
export function CustomerDetail({ id }: { id: string }) {
  const t = useTranslations("customers.detail");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const { data, loading, error, refetch } = useApi(() => customersApi.get(id), [id]);
  const [edited, setEdited] = useState<Customer | null>(null);
  const edit = useDisclosure();

  const customer = edited ?? data?.customer ?? null;
  const tickets = data?.tickets ?? [];

  if (error) return <ErrorState message={error} onRetry={refetch} retryLabel={tCommon("retry")} />;
  if (loading || !customer) return <CustomerDetailSkeleton />;

  return (
    <div className="space-y-4">
      <Link
        href="/customers"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("back")}
      </Link>

      <Card>
        <CardContent className="flex flex-wrap items-start justify-between gap-4 p-5">
          <div className="flex items-center gap-4">
            <Avatar name={customer.name} color={CUSTOMER_COLOR} size="lg" />
            <div className="min-w-0">
              <h1 className="font-display text-xl font-bold text-foreground">{customer.name}</h1>
              <a href={`mailto:${customer.email}`} className="text-sm text-primary hover:underline">
                {customer.email}
              </a>
              {customer.company && (
                <p className="text-sm text-muted-foreground">{customer.company}</p>
              )}
              <p className="mt-1 text-xs text-muted-foreground">
                {t("since", { date: formatDate(customer.createdAt, locale) })}
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={edit.onOpen}>
            <Pencil className="h-4 w-4" />
            {t("edit")}
          </Button>
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-2 text-sm font-semibold text-foreground">{t("ticketsHeading")}</h2>
        {tickets.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            {t("noTickets")}
          </p>
        ) : (
          <div className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
            {tickets.map((ticket) => (
              <TicketRow key={ticket.id} ticket={ticket} />
            ))}
          </div>
        )}
      </div>

      <EditCustomerModal
        open={edit.open}
        onClose={edit.onClose}
        customer={customer}
        onSaved={setEdited}
      />
    </div>
  );
}
