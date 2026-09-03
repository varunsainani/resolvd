import type { Prisma } from "@prisma/client";
import { Router } from "express";

import { retrieveArticles, suggestReply } from "../ai";
import { config } from "../config";
import { TICKET_STATUSES } from "../lib/constants";
import { ApiError, notFound } from "../lib/http";
import { ticketDetailInclude } from "../lib/include";
import { hitDailyLimit } from "../lib/rate-limit";
import { serializeTicketDetail } from "../lib/serialize";
import { oneOf, requireString } from "../lib/validate";
import { requireUser } from "../middleware/auth";
import { prisma } from "../prisma";

// mergeParams so this router, mounted at /api/tickets/:ticketId, can read the id.
export const messagesRouter = Router({ mergeParams: true });

messagesRouter.use(requireUser);

// POST /api/tickets/:ticketId/messages — post an agent reply or internal note.
// The first public reply stamps firstResponseAt (meeting the response SLA) and
// an optional status moves the ticket in the same action.
messagesRouter.post("/messages", async (req, res) => {
  const { ticketId } = req.params as { ticketId: string };
  const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });
  if (!ticket) throw notFound("ticket_not_found");

  const body = req.body ?? {};
  const text = requireString(body.body, "message_required");
  const isInternal = Boolean(body.isInternal);

  await prisma.message.create({
    data: {
      ticketId: ticket.id,
      authorType: "AGENT",
      authorUserId: req.userId,
      body: text,
      isInternal,
    },
  });

  const updates: Prisma.TicketUpdateInput = {};
  // A public agent reply is the first response for SLA purposes.
  if (!isInternal && !ticket.firstResponseAt) updates.firstResponseAt = new Date();

  if (body.status !== undefined) {
    const status = oneOf(body.status, TICKET_STATUSES, "invalid_status");
    updates.status = status;
    const closing = status === "RESOLVED" || status === "CLOSED";
    if (closing && !ticket.resolvedAt) updates.resolvedAt = new Date();
    if (!closing && ticket.resolvedAt) updates.resolvedAt = null;
  }

  if (Object.keys(updates).length) {
    await prisma.ticket.update({ where: { id: ticket.id }, data: updates });
  }

  const full = await prisma.ticket.findUnique({
    where: { id: ticket.id },
    include: ticketDetailInclude,
  });
  res.status(201).json({ ticket: serializeTicketDetail(full!, new Date()) });
});

// POST /api/tickets/:ticketId/suggest — draft an AI reply for the agent to
// review, grounded in the knowledge base. Rate-limited per agent per day.
messagesRouter.post("/suggest", async (req, res) => {
  const { ticketId } = req.params as { ticketId: string };
  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
    include: {
      customer: true,
      messages: { orderBy: { createdAt: "asc" } },
    },
  });
  if (!ticket) throw notFound("ticket_not_found");

  if (hitDailyLimit(`suggest:${req.userId}`, config.dailySuggestLimit)) {
    throw new ApiError(429, "daily_suggest_limit");
  }

  // Ground on the customer's words: subject plus the latest inbound message.
  const lastCustomer = [...ticket.messages].reverse().find((m) => m.authorType === "CUSTOMER");
  const queryText = `${ticket.subject} ${lastCustomer?.body ?? ""}`.trim();
  const candidates = await prisma.kbArticle.findMany();
  const articles = retrieveArticles(candidates, queryText);

  // Internal notes never feed a customer-facing draft.
  const thread = ticket.messages
    .filter((m) => !m.isInternal)
    .map((m) => ({ authorType: m.authorType, body: m.body }));

  const suggestion = await suggestReply({
    subject: ticket.subject,
    customerName: ticket.customer?.name,
    agentName: req.user?.name,
    messages: thread,
    articles,
    locale: req.locale,
  });

  res.json({ suggestion });
});
