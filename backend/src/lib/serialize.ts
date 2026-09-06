import type { CannedResponse, Customer, KbArticle, Message, Ticket, User } from "@prisma/client";

import { minutesRemaining, slaState } from "./sla";

// Public shape of an authenticated user (never leaks the password hash).
export function serializeUser(u: User) {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    locale: u.locale,
    theme: u.theme,
    avatarColor: u.avatarColor,
  };
}

// Compact reference to an agent, used for assignee and message author display.
export function serializeAgentRef(u: Pick<User, "id" | "name" | "avatarColor"> | null | undefined) {
  if (!u) return null;
  return { id: u.id, name: u.name, avatarColor: u.avatarColor };
}

export function serializeCustomer(c: Customer) {
  return {
    id: c.id,
    name: c.name,
    email: c.email,
    company: c.company,
    createdAt: c.createdAt.toISOString(),
  };
}

// Customer with an aggregated ticket count for the directory list.
export type CustomerWithCount = Customer & { _count?: { tickets: number } };

export function serializeCustomerSummary(c: CustomerWithCount) {
  return {
    ...serializeCustomer(c),
    ticketCount: c._count?.tickets ?? 0,
  };
}

// Knowledge base article, full body included (used by list and detail alike;
// bodies are short enough not to need a separate compact shape).
export function serializeKbArticle(a: KbArticle) {
  return {
    id: a.id,
    title: a.title,
    body: a.body,
    category: a.category,
    keywords: a.keywords,
    createdAt: a.createdAt.toISOString(),
    updatedAt: a.updatedAt.toISOString(),
  };
}

// Canned (macro) response an agent can drop into a reply.
export function serializeCannedResponse(c: CannedResponse) {
  return {
    id: c.id,
    title: c.title,
    body: c.body,
    category: c.category,
    createdAt: c.createdAt.toISOString(),
  };
}

// Trimmed, safe-to-show-a-customer view returned by the public submit form and
// status lookup. Never exposes assignee, internal notes, or SLA internals.
export function serializePublicTicket(t: Ticket) {
  return {
    reference: t.reference,
    subject: t.subject,
    status: t.status,
    priority: t.priority,
    category: t.category,
    sentiment: t.sentiment,
    summary: t.summary,
    aiTriaged: t.aiTriaged,
    createdAt: t.createdAt.toISOString(),
  };
}

// Team member with assignment counts for the admin roster.
export type AgentWithCounts = User & { openAssigned?: number; totalAssigned?: number };

export function serializeAgentSummary(u: AgentWithCounts) {
  return {
    ...serializeUser(u),
    createdAt: u.createdAt.toISOString(),
    openAssigned: u.openAssigned ?? 0,
    totalAssigned: u.totalAssigned ?? 0,
  };
}

type MessageWithAuthor = Message & {
  authorUser?: Pick<User, "id" | "name" | "avatarColor"> | null;
};

export function serializeMessage(m: MessageWithAuthor) {
  return {
    id: m.id,
    authorType: m.authorType,
    author: serializeAgentRef(m.authorUser),
    body: m.body,
    isInternal: m.isInternal,
    createdAt: m.createdAt.toISOString(),
  };
}

// Ticket tags arrive as TicketTag join rows with an included `tag`.
export function serializeTag(row: { tag: { name: string; color: string } }) {
  return { name: row.tag.name, color: row.tag.color };
}

// A tag from the shared vocabulary with how many tickets carry it, for the tag
// roster / filter chips.
export type TagWithCount = { id: string; name: string; color: string; _count?: { tickets: number } };

export function serializeTagRecord(t: TagWithCount) {
  return { id: t.id, name: t.name, color: t.color, count: t._count?.tickets ?? 0 };
}

// Two SLA milestones (first response, resolution) as state + minutes left,
// ready to drive the countdown badges in the UI.
export function serializeSla(t: Ticket, now: Date) {
  const firstDone = t.firstResponseAt != null;
  const resolveDone =
    t.resolvedAt != null || t.status === "RESOLVED" || t.status === "CLOSED";
  return {
    firstResponse: {
      dueAt: t.slaFirstDueAt ? t.slaFirstDueAt.toISOString() : null,
      state: slaState(t.slaFirstDueAt, now, firstDone),
      minutesRemaining: minutesRemaining(t.slaFirstDueAt, now),
    },
    resolution: {
      dueAt: t.slaResolveDueAt ? t.slaResolveDueAt.toISOString() : null,
      state: slaState(t.slaResolveDueAt, now, resolveDone),
      minutesRemaining: minutesRemaining(t.slaResolveDueAt, now),
    },
  };
}

type AgentRef = Pick<User, "id" | "name" | "avatarColor">;
type TagRow = { tag: { name: string; color: string } };

// A ticket with the relations the list and detail views include.
export type TicketWithRelations = Ticket & {
  customer?: Customer | null;
  assignee?: AgentRef | null;
  tags?: TagRow[];
  messages?: MessageWithAuthor[];
  _count?: { messages: number };
};

// Compact ticket shape for the inbox list: enough to render a row without the
// full conversation. `now` drives the SLA badges.
export function serializeTicketRow(t: TicketWithRelations, now: Date) {
  return {
    id: t.id,
    reference: t.reference,
    subject: t.subject,
    status: t.status,
    priority: t.priority,
    channel: t.channel,
    category: t.category,
    sentiment: t.sentiment,
    aiTriaged: t.aiTriaged,
    customer: t.customer ? serializeCustomer(t.customer) : null,
    assignee: serializeAgentRef(t.assignee),
    tags: (t.tags || []).map(serializeTag),
    messageCount: t._count?.messages ?? t.messages?.length ?? 0,
    createdAt: t.createdAt.toISOString(),
    updatedAt: t.updatedAt.toISOString(),
    sla: serializeSla(t, now),
  };
}

// Full ticket shape for the detail view: the row plus the AI summary, response
// timestamps, and the ordered conversation thread.
export function serializeTicketDetail(t: TicketWithRelations, now: Date) {
  return {
    ...serializeTicketRow(t, now),
    summary: t.summary,
    firstResponseAt: t.firstResponseAt ? t.firstResponseAt.toISOString() : null,
    resolvedAt: t.resolvedAt ? t.resolvedAt.toISOString() : null,
    messages: (t.messages || []).map(serializeMessage),
  };
}
