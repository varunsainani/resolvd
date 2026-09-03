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
