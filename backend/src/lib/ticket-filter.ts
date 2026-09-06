import type { Prisma } from "@prisma/client";

import { CHANNELS, TICKET_PRIORITIES, TICKET_STATUSES } from "./constants";
import { parseReference } from "./reference";

// Build the Prisma WHERE clause for the inbox list from raw query params. Pure
// and self-contained so the filter and search rules are unit tested without a
// request or a database. `userId` resolves the `assignee=me` shortcut.
export function buildTicketWhere(
  q: Record<string, unknown>,
  userId?: string,
): Prisma.TicketWhereInput {
  const where: Prisma.TicketWhereInput = {};

  if (typeof q.status === "string" && (TICKET_STATUSES as readonly string[]).includes(q.status)) {
    where.status = q.status as Prisma.TicketWhereInput["status"];
  }
  if (typeof q.priority === "string" && (TICKET_PRIORITIES as readonly string[]).includes(q.priority)) {
    where.priority = q.priority as Prisma.TicketWhereInput["priority"];
  }
  if (typeof q.channel === "string" && (CHANNELS as readonly string[]).includes(q.channel)) {
    where.channel = q.channel as Prisma.TicketWhereInput["channel"];
  }

  if (q.assignee === "me" && userId) {
    where.assigneeId = userId;
  } else if (q.assignee === "unassigned") {
    where.assigneeId = null;
  } else if (typeof q.assignee === "string" && q.assignee && q.assignee !== "me") {
    where.assigneeId = q.assignee;
  }

  const search = typeof q.q === "string" ? q.q.trim() : "";
  if (search) {
    const or: Prisma.TicketWhereInput[] = [
      { subject: { contains: search, mode: "insensitive" } },
      { customer: { name: { contains: search, mode: "insensitive" } } },
      { customer: { email: { contains: search, mode: "insensitive" } } },
    ];
    const ref = parseReference(search);
    if (ref !== null) or.push({ reference: ref });
    where.OR = or;
  }

  return where;
}
