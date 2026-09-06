import type { Prisma } from "@prisma/client";
import { Router } from "express";

import {
  CHANNELS,
  TICKET_PRIORITIES,
  TICKET_STATUSES,
  TicketPriorityValue,
  normalizeCategory,
} from "../lib/constants";
import { badRequest, notFound } from "../lib/http";
import { ticketDetailInclude, ticketRowInclude } from "../lib/include";
import { buildPageMeta, parsePageParams } from "../lib/pagination";
import { computeSlaDueDates } from "../lib/sla";
import { serializeTicketDetail, serializeTicketRow } from "../lib/serialize";
import { buildTicketWhere } from "../lib/ticket-filter";
import {
  oneOf,
  optionalString,
  requireEmail,
  requireString,
} from "../lib/validate";
import { requireUser } from "../middleware/auth";
import { prisma } from "../prisma";
import { applyTags, createTicketFromIntake, removeTicketTag } from "../services/tickets";
import { normalizeTagName } from "../lib/tags";

export const ticketsRouter = Router();

// Everything under /api/tickets requires an authenticated agent.
ticketsRouter.use(requireUser);

// Translate the `sort` query into a Prisma orderBy. Enum columns order by
// declaration, so priority desc surfaces URGENT first.
export function orderFor(sort: unknown): Prisma.TicketOrderByWithRelationInput[] {
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
  const where = buildTicketWhere(q, req.userId);
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

// Load a ticket with its full detail relations, or throw a localized 404.
async function loadTicketDetail(id: string) {
  const ticket = await prisma.ticket.findUnique({
    where: { id },
    include: ticketDetailInclude,
  });
  if (!ticket) throw notFound("ticket_not_found");
  return ticket;
}

// GET /api/tickets/:id — full ticket with the conversation thread.
ticketsRouter.get("/:id", async (req, res) => {
  const ticket = await loadTicketDetail(req.params.id);
  res.json({ ticket: serializeTicketDetail(ticket, new Date()) });
});

// POST /api/tickets — create a ticket from an agent-entered intake. The opening
// message is AI-triaged and the SLA clocks start from the resulting priority.
ticketsRouter.post("/", async (req, res) => {
  const body = req.body ?? {};
  const cust = body.customer ?? {};

  const subject = requireString(body.subject, "subject_required");
  const message = requireString(body.message, "message_required");
  const customerName = requireString(cust.name, "name_required");
  const customerEmail = requireEmail(cust.email);

  const channel = body.channel !== undefined ? oneOf(body.channel, CHANNELS, "invalid_input") : undefined;
  const priorityOverride =
    body.priority !== undefined ? oneOf(body.priority, TICKET_PRIORITIES, "invalid_priority") : undefined;

  const ticketId = await createTicketFromIntake({
    subject,
    message,
    channel,
    priorityOverride,
    customer: { name: customerName, email: customerEmail, company: optionalString(cust.company) },
  });

  const ticket = await loadTicketDetail(ticketId);
  res.status(201).json({ ticket: serializeTicketDetail(ticket, new Date()) });
});

// Confirm an assignee id points to a real user, or throw a localized 404.
async function resolveAssignee(assigneeId: unknown): Promise<string | null> {
  if (assigneeId === null || assigneeId === "") return null;
  if (typeof assigneeId !== "string") throw notFound("assignee_not_found");
  const agent = await prisma.user.findUnique({ where: { id: assigneeId } });
  if (!agent) throw notFound("assignee_not_found");
  return agent.id;
}

// PATCH /api/tickets/:id — change status, priority, category, or assignee.
ticketsRouter.patch("/:id", async (req, res) => {
  const existing = await prisma.ticket.findUnique({ where: { id: req.params.id } });
  if (!existing) throw notFound("ticket_not_found");

  const body = req.body ?? {};
  const data: Prisma.TicketUpdateInput = {};

  if (body.status !== undefined) {
    const status = oneOf(body.status, TICKET_STATUSES, "invalid_status");
    data.status = status;
    const closing = status === "RESOLVED" || status === "CLOSED";
    if (closing && !existing.resolvedAt) data.resolvedAt = new Date();
    if (!closing && existing.resolvedAt) data.resolvedAt = null;
  }

  if (body.priority !== undefined) {
    const priority = oneOf(body.priority, TICKET_PRIORITIES, "invalid_priority") as TicketPriorityValue;
    data.priority = priority;
    // SLA clocks run from creation, so recompute both deadlines for the new tier.
    const { firstDue, resolveDue } = computeSlaDueDates(priority, existing.createdAt);
    data.slaFirstDueAt = firstDue;
    data.slaResolveDueAt = resolveDue;
  }

  if (body.category !== undefined) data.category = normalizeCategory(body.category);

  if (body.assigneeId !== undefined) {
    const id = await resolveAssignee(body.assigneeId);
    data.assignee = id ? { connect: { id } } : { disconnect: true };
  }

  await prisma.ticket.update({ where: { id: existing.id }, data });
  const ticket = await loadTicketDetail(existing.id);
  res.json({ ticket: serializeTicketDetail(ticket, new Date()) });
});

// POST /api/tickets/:id/assign — claim a ticket. With no body it assigns to the
// caller ("assign to me"); pass assigneeId to hand it to another agent, or null
// to release it back to the queue.
ticketsRouter.post("/:id/assign", async (req, res) => {
  const existing = await prisma.ticket.findUnique({ where: { id: req.params.id } });
  if (!existing) throw notFound("ticket_not_found");

  const body = req.body ?? {};
  const target = body.assigneeId === undefined ? req.userId : body.assigneeId;
  const id = await resolveAssignee(target);

  await prisma.ticket.update({
    where: { id: existing.id },
    data: { assignee: id ? { connect: { id } } : { disconnect: true } },
  });
  const ticket = await loadTicketDetail(existing.id);
  res.json({ ticket: serializeTicketDetail(ticket, new Date()) });
});

// POST /api/tickets/:id/tags — manually add a tag (agents curate beyond the AI
// suggestions). Idempotent: re-adding an existing tag is a no-op.
ticketsRouter.post("/:id/tags", async (req, res) => {
  const existing = await prisma.ticket.findUnique({ where: { id: req.params.id } });
  if (!existing) throw notFound("ticket_not_found");

  const name = normalizeTagName((req.body ?? {}).name);
  if (!name) throw badRequest("invalid_input");
  await applyTags(existing.id, [name]);

  const ticket = await loadTicketDetail(existing.id);
  res.status(201).json({ ticket: serializeTicketDetail(ticket, new Date()) });
});

// DELETE /api/tickets/:id/tags/:name — remove a tag from a ticket.
ticketsRouter.delete("/:id/tags/:name", async (req, res) => {
  const existing = await prisma.ticket.findUnique({ where: { id: req.params.id } });
  if (!existing) throw notFound("ticket_not_found");

  await removeTicketTag(existing.id, req.params.name);

  const ticket = await loadTicketDetail(existing.id);
  res.json({ ticket: serializeTicketDetail(ticket, new Date()) });
});
