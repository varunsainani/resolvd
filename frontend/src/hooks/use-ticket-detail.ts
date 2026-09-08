"use client";

import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";

import { ApiError, ticketsApi } from "@/lib/api";
import type { TicketDetail } from "@/types";

export interface TicketDetailState {
  ticket: TicketDetail | null;
  // Replace the local ticket after a mutation returns the updated detail.
  setTicket: (ticket: TicketDetail) => void;
  loading: boolean;
  error: string | null;
  notFound: boolean;
  refetch: () => void;
}

// Load one ticket and hold it in local state so in-place mutations (status,
// assignee, replies, tags) can swap in the server's updated copy without a
// refetch. A 404 is surfaced as `notFound` rather than a generic error so the
// page can render a dedicated empty state.
export function useTicketDetail(id: string): TicketDetailState {
  const t = useTranslations("common");
  const [ticket, setTicket] = useState<TicketDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setNotFound(false);
    ticketsApi
      .get(id)
      .then((res) => {
        if (cancelled) return;
        setTicket(res.ticket);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 404) setNotFound(true);
        else setError(err instanceof ApiError ? err.message : t("error"));
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id, tick, t]);

  const refetch = useCallback(() => setTick((n) => n + 1), []);
  return { ticket, setTicket, loading, error, notFound, refetch };
}
