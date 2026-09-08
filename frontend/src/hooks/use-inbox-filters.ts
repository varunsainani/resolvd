"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

import {
  INBOX_DEFAULTS,
  hasActiveFilters,
  inboxToQuery,
  parseInboxParams,
  type InboxFilters,
} from "@/lib/inbox-params";

export interface InboxFiltersController {
  filters: InboxFilters;
  active: boolean;
  // Patch one or more filters; any change other than `page` resets to page 1.
  setFilters: (patch: Partial<InboxFilters>) => void;
  setPage: (page: number) => void;
  clear: () => void;
}

// Inbox filter state lives in the URL so a filtered view is shareable and
// survives refresh and back-navigation. This wraps the read (searchParams ->
// InboxFilters) and the write (InboxFilters -> router.replace) behind one
// controller so pages never touch the query string directly.
export function useInboxFilters(): InboxFiltersController {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = useMemo(() => parseInboxParams(searchParams), [searchParams]);

  const push = useCallback(
    (next: InboxFilters) => {
      const qs = new URLSearchParams(inboxToQuery(next)).toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname],
  );

  const setFilters = useCallback(
    (patch: Partial<InboxFilters>) => {
      const resetsPage = Object.keys(patch).some((key) => key !== "page");
      push({ ...filters, ...patch, ...(resetsPage ? { page: 1 } : {}) });
    },
    [filters, push],
  );

  const setPage = useCallback((page: number) => push({ ...filters, page }), [filters, push]);

  const clear = useCallback(() => push({ ...INBOX_DEFAULTS }), [push]);

  return { filters, active: hasActiveFilters(filters), setFilters, setPage, clear };
}
