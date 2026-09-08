import { CHANNELS, TICKET_PRIORITIES, TICKET_STATUSES } from "@/types";
import type { Channel, TicketPriority, TicketStatus } from "@/types";

export type InboxSort = "newest" | "oldest" | "updated" | "priority";
export const INBOX_SORTS: InboxSort[] = ["newest", "oldest", "updated", "priority"];

// Inbox filter state. "" means "all"; for `assignee`, "me" and "unassigned" are
// sentinels the backend understands, otherwise it is an agent id.
export interface InboxFilters {
  status: TicketStatus | "";
  priority: TicketPriority | "";
  channel: Channel | "";
  assignee: string;
  q: string;
  sort: InboxSort;
  page: number;
}

export const INBOX_DEFAULTS: InboxFilters = {
  status: "",
  priority: "",
  channel: "",
  assignee: "",
  q: "",
  sort: "newest",
  page: 1,
};

// Minimal reader so this parses both a URLSearchParams and Next's readonly
// variant without pulling in the DOM.
type ParamReader = Pick<URLSearchParams, "get">;

function oneOf<T extends string>(value: string | null, allowed: readonly T[]): T | "" {
  return value && (allowed as readonly string[]).includes(value) ? (value as T) : "";
}

// Read inbox filter state from URL params, coercing anything unknown back to a
// default so a hand-edited or stale URL can never produce an invalid filter.
export function parseInboxParams(params: ParamReader): InboxFilters {
  const pageRaw = Number(params.get("page"));
  const page = Number.isFinite(pageRaw) && pageRaw >= 1 ? Math.floor(pageRaw) : 1;

  return {
    status: oneOf(params.get("status"), TICKET_STATUSES),
    priority: oneOf(params.get("priority"), TICKET_PRIORITIES),
    channel: oneOf(params.get("channel"), CHANNELS),
    assignee: params.get("assignee")?.trim() || "",
    q: params.get("q")?.trim() || "",
    sort: oneOf(params.get("sort"), INBOX_SORTS) || "newest",
    page,
  };
}

// Serialize filters back to a plain record, omitting defaults so the URL and the
// API query stay clean (no `?sort=newest&page=1` noise).
export function inboxToQuery(filters: InboxFilters): Record<string, string> {
  const out: Record<string, string> = {};
  if (filters.status) out.status = filters.status;
  if (filters.priority) out.priority = filters.priority;
  if (filters.channel) out.channel = filters.channel;
  if (filters.assignee) out.assignee = filters.assignee;
  if (filters.q) out.q = filters.q;
  if (filters.sort !== "newest") out.sort = filters.sort;
  if (filters.page > 1) out.page = String(filters.page);
  return out;
}

// True when any user-facing filter (not paging) is active. Drives the Clear
// button and the choice between the "no matches" and "inbox empty" states.
export function hasActiveFilters(filters: InboxFilters): boolean {
  return Boolean(
    filters.status || filters.priority || filters.channel || filters.assignee || filters.q,
  );
}
