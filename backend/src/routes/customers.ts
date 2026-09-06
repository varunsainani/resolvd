import { Router } from "express";

import { notFound } from "../lib/http";
import { ticketRowInclude } from "../lib/include";
import { buildPageMeta, parsePageParams } from "../lib/pagination";
import {
  serializeCustomer,
  serializeCustomerSummary,
  serializeTicketRow,
} from "../lib/serialize";
import { optionalString, requireString } from "../lib/validate";
import { requireUser } from "../middleware/auth";
import { prisma } from "../prisma";
import { customerSearchWhere } from "../services/customers";

export const customersRouter = Router();

customersRouter.use(requireUser);

// GET /api/customers — searchable, paginated customer directory with a ticket
// count per row. Newest customers first.
customersRouter.get("/", async (req, res) => {
  const q = req.query as Record<string, unknown>;
  const search = typeof q.q === "string" ? q.q : "";
  const where = customerSearchWhere(search);
  const page = parsePageParams(q);

  const [total, rows] = await Promise.all([
    prisma.customer.count({ where }),
    prisma.customer.findMany({
      where,
      include: { _count: { select: { tickets: true } } },
      orderBy: { createdAt: "desc" },
      skip: page.skip,
      take: page.take,
    }),
  ]);

  res.json({
    data: rows.map(serializeCustomerSummary),
    meta: buildPageMeta(total, page),
  });
});

// GET /api/customers/:id — one customer plus their tickets (most recent first).
customersRouter.get("/:id", async (req, res) => {
  const customer = await prisma.customer.findUnique({ where: { id: req.params.id } });
  if (!customer) throw notFound("customer_not_found");

  const tickets = await prisma.ticket.findMany({
    where: { customerId: customer.id },
    include: ticketRowInclude,
    orderBy: { createdAt: "desc" },
  });

  const now = new Date();
  res.json({
    customer: serializeCustomer(customer),
    tickets: tickets.map((t) => serializeTicketRow(t, now)),
  });
});

// PATCH /api/customers/:id — correct a customer's name or company (email is the
// identity key and stays put).
customersRouter.patch("/:id", async (req, res) => {
  const existing = await prisma.customer.findUnique({ where: { id: req.params.id } });
  if (!existing) throw notFound("customer_not_found");

  const body = req.body ?? {};
  const data: { name?: string; company?: string | null } = {};
  if (body.name !== undefined) data.name = requireString(body.name, "name_required");
  if (body.company !== undefined) data.company = optionalString(body.company) ?? null;

  const customer = await prisma.customer.update({ where: { id: existing.id }, data });
  res.json({ customer: serializeCustomer(customer) });
});
