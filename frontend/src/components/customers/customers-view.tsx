"use client";

import { Users } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { SearchBar } from "@/components/common/search-bar";
import { PageHeader } from "@/components/shell/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { ListSkeleton } from "@/components/ui/list-skeleton";
import { Pagination } from "@/components/ui/pagination";
import { Select } from "@/components/ui/select";
import { useApi } from "@/hooks";
import { customersApi, type CustomerListParams } from "@/lib/api";
import { CustomerTable } from "./customer-table";

export function CustomersView() {
  const t = useTranslations("customers");
  const tCommon = useTranslations("common");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("recent");
  const [page, setPage] = useState(1);

  const params: CustomerListParams = { q: q || undefined, sort, page, pageSize: 20 };
  const { data, loading, error, refetch } = useApi(
    () => customersApi.list(params),
    [JSON.stringify(params)],
  );
  const customers = data?.data ?? [];
  const meta = data?.meta;
  const filtered = q.trim().length > 0;

  return (
    <>
      <PageHeader title={t("title")} description={t("subtitle")} />
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="min-w-40 flex-1">
            <SearchBar
              value={q}
              onChange={(v) => {
                setQ(v);
                setPage(1);
              }}
              placeholder={t("searchPlaceholder")}
            />
          </div>
          <Select
            aria-label={t("sort")}
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setPage(1);
            }}
            className="w-auto"
          >
            <option value="recent">{t("sortRecent")}</option>
            <option value="name">{t("sortName")}</option>
            <option value="tickets">{t("sortTickets")}</option>
          </Select>
        </div>

        {error ? (
          <ErrorState message={error} onRetry={refetch} retryLabel={tCommon("retry")} />
        ) : loading && !data ? (
          <ListSkeleton rows={6} />
        ) : customers.length === 0 ? (
          <EmptyState
            icon={Users}
            title={filtered ? t("emptyFiltered.title") : t("empty.title")}
            description={filtered ? t("emptyFiltered.body") : t("empty.body")}
          />
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              {t("count", { count: meta?.total ?? customers.length })}
            </p>
            <CustomerTable customers={customers} />
            {meta && (
              <div className="flex justify-center pt-2">
                <Pagination page={meta.page} totalPages={meta.totalPages} onChange={setPage} />
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
