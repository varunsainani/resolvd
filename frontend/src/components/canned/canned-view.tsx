"use client";

import { MessageSquareText, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { SearchBar } from "@/components/common/search-bar";
import { PageHeader } from "@/components/shell/page-header";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { ListSkeleton } from "@/components/ui/list-skeleton";
import { Pagination } from "@/components/ui/pagination";
import { Select } from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";
import { useApi, useDisclosure, useMutation } from "@/hooks";
import { cannedApi, type CannedListParams } from "@/lib/api";
import type { CannedResponse } from "@/types";
import { CannedFormModal } from "./canned-form-modal";
import { CannedList } from "./canned-list";

export function CannedView() {
  const t = useTranslations("canned");
  const tCommon = useTranslations("common");
  const { toast } = useToast();
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("title");
  const [page, setPage] = useState(1);
  const form = useDisclosure();
  const [editCanned, setEditCanned] = useState<CannedResponse | null>(null);
  const [deleting, setDeleting] = useState<CannedResponse | null>(null);

  const params: CannedListParams = { q: q || undefined, sort, page, pageSize: 12 };
  const { data, loading, error, refetch } = useApi(
    () => cannedApi.list(params),
    [JSON.stringify(params)],
  );
  const responses = data?.data ?? [];
  const meta = data?.meta;
  const filtered = q.trim().length > 0;

  const del = useMutation((id: string) => cannedApi.remove(id));

  function openCreate() {
    setEditCanned(null);
    form.onOpen();
  }
  function openEdit(canned: CannedResponse) {
    setEditCanned(canned);
    form.onOpen();
  }
  async function confirmDelete() {
    if (!deleting) return;
    const res = await del.mutate(deleting.id);
    if (res) {
      toast(t("deleteConfirm.deleted"));
      setDeleting(null);
      refetch();
    }
  }

  return (
    <>
      <PageHeader
        title={t("title")}
        description={t("subtitle")}
        action={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" />
            {t("new")}
          </Button>
        }
      />
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
            <option value="title">{t("sortTitle")}</option>
            <option value="recent">{t("sortRecent")}</option>
          </Select>
        </div>

        {error ? (
          <ErrorState message={error} onRetry={refetch} retryLabel={tCommon("retry")} />
        ) : loading && !data ? (
          <ListSkeleton rows={4} />
        ) : responses.length === 0 ? (
          <EmptyState
            icon={MessageSquareText}
            title={filtered ? t("emptyFiltered.title") : t("empty.title")}
            description={filtered ? t("emptyFiltered.body") : t("empty.body")}
            action={
              filtered ? undefined : (
                <Button onClick={openCreate}>
                  <Plus className="h-4 w-4" />
                  {t("new")}
                </Button>
              )
            }
          />
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              {t("count", { count: meta?.total ?? responses.length })}
            </p>
            <CannedList responses={responses} onEdit={openEdit} onDelete={setDeleting} />
            {meta && (
              <div className="flex justify-center pt-2">
                <Pagination page={meta.page} totalPages={meta.totalPages} onChange={setPage} />
              </div>
            )}
          </>
        )}
      </div>

      {form.open && (
        <CannedFormModal open onClose={form.onClose} canned={editCanned} onSaved={refetch} />
      )}
      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
        title={t("deleteConfirm.title")}
        message={t("deleteConfirm.message")}
        confirmLabel={t("deleteConfirm.confirm")}
        cancelLabel={tCommon("cancel")}
        loading={del.loading}
        danger
      />
    </>
  );
}
