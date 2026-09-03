import type { Customer } from "@prisma/client";

import { colorForTag } from "../lib/constants";
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
