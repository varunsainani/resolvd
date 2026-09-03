import type { Prisma } from "@prisma/client";

// Only the agent fields the UI renders for an assignee or message author.
const agentRefSelect = { id: true, name: true, avatarColor: true } as const;

// Relations needed to render a ticket row in the inbox list.
export const ticketRowInclude = {
  customer: true,
  assignee: { select: agentRefSelect },
  tags: { include: { tag: true } },
  _count: { select: { messages: true } },
} satisfies Prisma.TicketInclude;

// Relations for the full ticket detail view, including the ordered thread.
export const ticketDetailInclude = {
  customer: true,
  assignee: { select: agentRefSelect },
  tags: { include: { tag: true } },
  messages: {
    orderBy: { createdAt: "asc" },
    include: { authorUser: { select: agentRefSelect } },
  },
} satisfies Prisma.TicketInclude;
