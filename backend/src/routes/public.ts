import { Router } from "express";

import { config } from "../config";
import { ApiError, notFound } from "../lib/http";
import { hitDailyLimit } from "../lib/rate-limit";
import { serializePublicTicket } from "../lib/serialize";
import { optionalString, requireEmail, requireString } from "../lib/validate";
import { prisma } from "../prisma";
import { createTicketFromIntake } from "../services/tickets";

// Public, unauthenticated endpoints backing the customer-facing submit form.
export const publicRouter = Router();

// POST /api/public/tickets — a customer opens a ticket from the website. It runs
// the same AI intake as an agent-entered ticket and returns the instant triage
// result (priority, category, summary) so the customer sees it was understood.
// Rate-limited per email per day so the demo form cannot be abused.
publicRouter.post("/tickets", async (req, res) => {
  const body = req.body ?? {};
  const name = requireString(body.name, "name_required");
  const email = requireEmail(body.email);
  const subject = requireString(body.subject, "subject_required");
  const message = requireString(body.message, "message_required");

  if (hitDailyLimit(`public:${email}`, config.dailyPublicSubmitLimit)) {
    throw new ApiError(429, "public_submit_limit");
  }

  const ticketId = await createTicketFromIntake({
    subject,
    message,
    channel: "WEB",
    customer: { name, email, company: optionalString(body.company) },
  });

  const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });
  res.status(201).json({ ticket: serializePublicTicket(ticket!) });
});

// GET /api/public/tickets/:reference?email= — a customer checks the status of a
// ticket they opened. The email must match the ticket's customer so references
// cannot be enumerated.
publicRouter.get("/tickets/:reference", async (req, res) => {
  const reference = Number(String(req.params.reference).replace(/^#/, ""));
  const email = requireEmail(req.query.email);
  if (!Number.isInteger(reference) || reference <= 0) throw notFound("ticket_not_found");

  const ticket = await prisma.ticket.findUnique({
    where: { reference },
    include: { customer: true },
  });
  if (!ticket || ticket.customer?.email.toLowerCase() !== email) {
    throw notFound("ticket_not_found");
  }

  res.json({ ticket: serializePublicTicket(ticket) });
});
