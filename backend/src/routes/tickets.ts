import type { Prisma } from "@prisma/client";
import { Router } from "express";

import { TICKET_PRIORITIES, TICKET_STATUSES } from "../lib/constants";
import { ticketRowInclude } from "../lib/include";
import { buildPageMeta, parsePageParams } from "../lib/pagination";
import { serializeTicketRow } from "../lib/serialize";
import { requireUser } from "../middleware/auth";
import { prisma } from "../prisma";

export const ticketsRouter = Router();

// Everything under /api/tickets requires an authenticated agent.
ticketsRouter.use(requireUser);

// Translate the `sort` query into a Prisma orderBy. Enum columns order by
// declaration, so priority desc surfaces URGENT first.
function orderFor(sort: unknown): Prisma.TicketOrderByWithRelationInput[] {
  switch (sort) {
    case "oldest":
      return [{ createdAt: "asc" }];
    case "updated":
      return [{ updatedAt: "desc" }];
    case "priority":
      return [{ priority: "desc" }, { createdAt: "desc" }];
    default:
      return [{ createdAt: "desc" }];
  }
}

// GET /api/tickets — filtered, paginated inbox list.
ticketsRouter.get("/", async (req, res) => {
  const q = req.query as Record<string, unknown>;
  const where: Prisma.TicketWhereInput = {};

  if (typeof q.status === "string" && (TICKET_STATUSES as readonly string[]).includes(q.status)) {
    where.status = q.status as Prisma.TicketWhereInput["status"];
  }
  if (typeof q.priority === "string" && (TICKET_PRIORITIES as readonly string[]).includes(q.priority)) {
    where.priority = q.priority as Prisma.TicketWhereInput["priority"];
  }
  if (q.assignee === "me") {
    where.assigneeId = req.userId;
  } else if (q.assignee === "unassigned") {
    where.assigneeId = null;
  } else if (typeof q.assignee === "string" && q.assignee) {
    where.assigneeId = q.assignee;
  }

  const search = typeof q.q === "string" ? q.q.trim() : "";
  if (search) {
    const or: Prisma.TicketWhereInput[] = [
      { subject: { contains: search, mode: "insensitive" } },
      { customer: { name: { contains: search, mode: "insensitive" } } },
      { customer: { email: { contains: search, mode: "insensitive" } } },
    ];
    const ref = Number(search.replace(/^#/, ""));
    if (Number.isInteger(ref) && ref > 0) or.push({ reference: ref });
    where.OR = or;
  }

  const page = parsePageParams(q);
  const [total, rows] = await Promise.all([
    prisma.ticket.count({ where }),
    prisma.ticket.findMany({
      where,
      include: ticketRowInclude,
      orderBy: orderFor(q.sort),
      skip: page.skip,
      take: page.take,
    }),
  ]);

  const now = new Date();
  res.json({
    data: rows.map((r) => serializeTicketRow(r, now)),
    meta: buildPageMeta(total, page),
  });
});
