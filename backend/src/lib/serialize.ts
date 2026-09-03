import type { Customer, Message, Ticket, User } from "@prisma/client";

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
