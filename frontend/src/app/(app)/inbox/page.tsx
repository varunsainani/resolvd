"use client";

import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { Suspense } from "react";

import {
  InboxEmpty,
  InboxSummary,
  InboxToolbar,
  NewTicketModal,
  TicketList,
} from "@/components/inbox";
import { PageHeader } from "@/components/shell/page-header";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/ui/error-state";
import { ListSkeleton } from "@/components/ui/list-skeleton";
import { Pagination } from "@/components/ui/pagination";
import { useApi, useDisclosure, useInboxFilters } from "@/hooks";
import { ticketsApi, type TicketListParams } from "@/lib/api";

// The interactive inbox. Split out so it can sit inside a Suspense boundary,
// which useInboxFilters -> useSearchParams requires.
function InboxView() {
  const t = useTranslations("inbox");
  const tCommon = useTranslations("common");
  const { filters, active, setFilters, setPage, clear } = useInboxFilters();
  const newTicket = useDisclosure();

  const params: TicketListParams = {
    status: filters.status || undefined,
    priority: filters.priority || undefined,
    channel: filters.channel || undefined,
    assignee: filters.assignee || undefined,
    q: filters.q || undefined,
    sort: filters.sort,
    page: filters.page,
    pageSize: 20,
  };

  const key = JSON.stringify(filters);
  const { data, loading, error, refetch } = useApi(() => ticketsApi.list(params), [key]);

  const tickets = data?.data ?? [];
  const meta = data?.meta;

  return (
    <>
      <PageHeader
        title={t("title")}
        action={
          <Button onClick={newTicket.onOpen}>
            <Plus className="h-4 w-4" />
            {t("newTicket")}
          </Button>
        }
      />

      <div className="space-y-4">
        <InboxToolbar filters={filters} onChange={setFilters} />

        {error ? (
          <ErrorState message={error} onRetry={refetch} retryLabel={tCommon("retry")} />
        ) : loading && !data ? (
          <ListSkeleton rows={6} />
        ) : tickets.length === 0 ? (
          <>
            {meta && <InboxSummary total={meta.total} active={active} onClear={clear} />}
            <InboxEmpty filtered={active} onClear={clear} />
          </>
        ) : (
          <>
            <InboxSummary total={meta?.total ?? tickets.length} active={active} onClear={clear} />
            <TicketList tickets={tickets} />
            {meta && (
              <div className="flex justify-center pt-2">
                <Pagination page={meta.page} totalPages={meta.totalPages} onChange={setPage} />
              </div>
            )}
          </>
        )}
      </div>

      <NewTicketModal open={newTicket.open} onClose={newTicket.onClose} onCreated={refetch} />
    </>
  );
}

export default function InboxPage() {
  return (
    <Suspense fallback={<ListSkeleton rows={6} />}>
      <InboxView />
    </Suspense>
  );
}
