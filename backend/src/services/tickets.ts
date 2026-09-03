import type { Customer } from "@prisma/client";

import { triageTicket } from "../ai";
import type { LLMProvider } from "../llm";
import { ChannelValue, TicketPriorityValue, colorForTag } from "../lib/constants";
import { computeSlaDueDates } from "../lib/sla";
import { prisma } from "../prisma";

export interface CustomerInput {
  name: string;
  email: string;
  company?: string;
}

// Customers are keyed by email but the column is a plain index (a person can
// have several tickets), so we reuse the first match and only create when new.
export async function upsertCustomer(input: CustomerInput): Promise<Customer> {
  const existing = await prisma.customer.findFirst({ where: { email: input.email } });
  if (existing) return existing;
  return prisma.customer.create({
    data: { name: input.name, email: input.email, company: input.company ?? null },
  });
}

// Attach a set of tag names to a ticket. Tags are upserted into the shared
// vocabulary (with a stable color) and linked idempotently, so re-triage or a
// repeated tag never throws on the composite key.
export async function applyTags(ticketId: string, tagNames: string[]): Promise<void> {
  const unique = Array.from(new Set(tagNames.map((n) => n.toLowerCase().trim()).filter(Boolean)));
  for (const name of unique) {
    const tag = await prisma.tag.upsert({
      where: { name },
      update: {},
      create: { name, color: colorForTag(name) },
    });
    await prisma.ticketTag.upsert({
      where: { ticketId_tagId: { ticketId, tagId: tag.id } },
      update: {},
      create: { ticketId, tagId: tag.id },
    });
  }
}

export interface IntakeInput {
  subject: string;
  message: string;
  customer: CustomerInput;
  channel?: ChannelValue;
  // Optional manual priority; when omitted the AI-triaged priority is used.
  priorityOverride?: TicketPriorityValue;
}

// Create a ticket the way it lands from any channel: reuse or create the
// customer, run AI triage on the opening message, seed the SLA clocks from the
// resulting priority, record the customer's message, and attach triage tags.
export async function createTicketFromIntake(
  input: IntakeInput,
  provider?: LLMProvider,
): Promise<string> {
  const customer = await upsertCustomer(input.customer);
  const triage = await triageTicket(
    { subject: input.subject, message: input.message, customerName: customer.name },
    provider,
  );

  const priority = input.priorityOverride ?? triage.priority;
  const now = new Date();
  const { firstDue, resolveDue } = computeSlaDueDates(priority, now);

  const ticket = await prisma.ticket.create({
    data: {
      subject: input.subject,
      channel: input.channel ?? "WEB",
      priority,
      category: triage.category,
      sentiment: triage.sentiment,
      summary: triage.summary,
      aiTriaged: triage.source === "ai",
      customerId: customer.id,
      slaFirstDueAt: firstDue,
      slaResolveDueAt: resolveDue,
      messages: { create: { authorType: "CUSTOMER", body: input.message } },
    },
  });

  await applyTags(ticket.id, triage.tags);
  return ticket.id;
}
