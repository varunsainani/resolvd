import type { KbArticle, Ticket } from "@prisma/client";

// Build a KbArticle-shaped object for tests without touching the database.
export function makeArticle(partial: Partial<KbArticle> & { title: string }): KbArticle {
  const now = new Date("2026-01-01T00:00:00Z");
  return {
    id: partial.id || partial.title.toLowerCase().replace(/\s+/g, "-"),
    title: partial.title,
    body: partial.body || "",
    category: partial.category || "General",
    keywords: partial.keywords || "",
    createdAt: partial.createdAt || now,
    updatedAt: partial.updatedAt || now,
  };
}

// Build a Ticket-shaped object for serializer tests without a database.
export function makeTicket(partial: Partial<Ticket> = {}): Ticket {
  const now = new Date("2026-01-01T00:00:00Z");
  return {
    id: partial.id || "t1",
    reference: partial.reference ?? 1001,
    subject: partial.subject || "Cannot log in",
    status: partial.status || "OPEN",
    priority: partial.priority || "NORMAL",
    channel: partial.channel || "WEB",
    category: partial.category || "General",
    sentiment: partial.sentiment || "NEUTRAL",
    summary: partial.summary ?? null,
    aiTriaged: partial.aiTriaged ?? false,
    customerId: partial.customerId || "c1",
    assigneeId: partial.assigneeId ?? null,
    createdAt: partial.createdAt || now,
    updatedAt: partial.updatedAt || now,
    firstResponseAt: partial.firstResponseAt ?? null,
    resolvedAt: partial.resolvedAt ?? null,
    slaFirstDueAt: partial.slaFirstDueAt ?? null,
    slaResolveDueAt: partial.slaResolveDueAt ?? null,
  };
}
