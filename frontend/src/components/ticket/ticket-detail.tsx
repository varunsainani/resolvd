"use client";

import { useTranslations } from "next-intl";
import { useCallback } from "react";

import { ErrorState } from "@/components/ui/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { useMutation, useTicketDetail } from "@/hooks";
import { ticketsApi, type ReplyBody, type TicketPatchBody } from "@/lib/api";
import type { SuggestResult } from "@/types";
import { MessageThread } from "./message-thread";
import { ReplyComposer } from "./reply-composer";
import { TicketActionsProvider } from "./ticket-context";
import { TicketBackLink } from "./ticket-back-link";
import { TicketHeader } from "./ticket-header";
import { TicketNotFound } from "./ticket-not-found";
import { TicketSidebar } from "./ticket-sidebar";

function TicketDetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-4 w-28" />
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="min-w-0 flex-1 space-y-4">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <div className="space-y-4 lg:w-80 lg:shrink-0">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    </div>
  );
}

// The ticket detail view. Owns the ticket's local state and the mutation
// plumbing, exposing everything to the panels through TicketActionsProvider.
// Each mutation endpoint returns the updated ticket, so the whole view stays in
// sync without a refetch.
export function TicketDetail({ id }: { id: string }) {
  const tCommon = useTranslations("common");
  const tProps = useTranslations("ticketDetail.properties");
  const tTags = useTranslations("ticketDetail.tags");
  const { toast } = useToast();
  const { ticket, setTicket, loading, error, notFound, refetch } = useTicketDetail(id);

  const patchM = useMutation((body: TicketPatchBody) => ticketsApi.update(id, body));
  const assignM = useMutation((assigneeId: string | null) => ticketsApi.assign(id, assigneeId));
  const replyM = useMutation((body: ReplyBody) => ticketsApi.reply(id, body));
  const addTagM = useMutation((name: string) => ticketsApi.addTag(id, name));
  const removeTagM = useMutation((name: string) => ticketsApi.removeTag(id, name));
  const suggestM = useMutation(() => ticketsApi.suggest(id));

  const patch = useCallback(
    async (body: TicketPatchBody) => {
      const res = await patchM.mutate(body);
      if (res) {
        setTicket(res.ticket);
        toast(tProps("saved"));
      }
    },
    [patchM, setTicket, toast, tProps],
  );

  const assign = useCallback(
    async (assigneeId: string | null) => {
      const res = await assignM.mutate(assigneeId);
      if (res) {
        setTicket(res.ticket);
        toast(tProps("saved"));
      }
    },
    [assignM, setTicket, toast, tProps],
  );

  const reply = useCallback(
    async (body: ReplyBody) => {
      const res = await replyM.mutate(body);
      if (!res) return false;
      setTicket(res.ticket);
      return true;
    },
    [replyM, setTicket],
  );

  const addTag = useCallback(
    async (name: string) => {
      const res = await addTagM.mutate(name);
      if (res) {
        setTicket(res.ticket);
        toast(tTags("added"));
      }
    },
    [addTagM, setTicket, toast, tTags],
  );

  const removeTag = useCallback(
    async (name: string) => {
      const res = await removeTagM.mutate(name);
      if (res) {
        setTicket(res.ticket);
        toast(tTags("removed"));
      }
    },
    [removeTagM, setTicket, toast, tTags],
  );

  const suggest = useCallback(async (): Promise<SuggestResult | null> => {
    const res = await suggestM.mutate();
    return res?.suggestion ?? null;
  }, [suggestM]);

  if (notFound) return <TicketNotFound />;
  if (error) return <ErrorState message={error} onRetry={refetch} retryLabel={tCommon("retry")} />;
  if (loading || !ticket) return <TicketDetailSkeleton />;

  return (
    <TicketActionsProvider
      value={{
        ticket,
        patch,
        assign,
        reply,
        addTag,
        removeTag,
        suggest,
        patching: patchM.loading || assignM.loading,
      }}
    >
      <div className="space-y-4">
        <TicketBackLink />
        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="min-w-0 flex-1 space-y-6">
            <TicketHeader ticket={ticket} />
            <MessageThread ticket={ticket} />
            <ReplyComposer />
          </div>
          <div className="lg:w-80 lg:shrink-0">
            <TicketSidebar />
          </div>
        </div>
      </div>
    </TicketActionsProvider>
  );
}
