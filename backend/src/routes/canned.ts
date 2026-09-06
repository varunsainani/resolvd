import { Router } from "express";

import { normalizeCategory } from "../lib/constants";
import { notFound } from "../lib/http";
import { buildPageMeta, parsePageParams } from "../lib/pagination";
import { serializeCannedResponse } from "../lib/serialize";
import { requireString } from "../lib/validate";
import { requireUser } from "../middleware/auth";
import { prisma } from "../prisma";
import { cannedSearchWhere } from "../services/canned";

export const cannedRouter = Router();

cannedRouter.use(requireUser);

// GET /api/canned — searchable, category-filterable, paginated macro list.
cannedRouter.get("/", async (req, res) => {
  const q = req.query as Record<string, unknown>;
  const where = cannedSearchWhere(
    typeof q.q === "string" ? q.q : "",
    typeof q.category === "string" ? q.category : undefined,
  );
  const page = parsePageParams(q);

  const [total, rows] = await Promise.all([
    prisma.cannedResponse.count({ where }),
    prisma.cannedResponse.findMany({
      where,
      orderBy: { title: "asc" },
      skip: page.skip,
      take: page.take,
    }),
  ]);

  res.json({ data: rows.map(serializeCannedResponse), meta: buildPageMeta(total, page) });
});

// GET /api/canned/:id — a single macro.
cannedRouter.get("/:id", async (req, res) => {
  const canned = await prisma.cannedResponse.findUnique({ where: { id: req.params.id } });
  if (!canned) throw notFound("canned_not_found");
  res.json({ canned: serializeCannedResponse(canned) });
});

// POST /api/canned — create a reusable reply macro.
cannedRouter.post("/", async (req, res) => {
  const body = req.body ?? {};
  const canned = await prisma.cannedResponse.create({
    data: {
      title: requireString(body.title, "invalid_input"),
      body: requireString(body.body, "invalid_input"),
      category: normalizeCategory(body.category),
    },
  });
  res.status(201).json({ canned: serializeCannedResponse(canned) });
});

// PATCH /api/canned/:id — edit a macro.
cannedRouter.patch("/:id", async (req, res) => {
  const existing = await prisma.cannedResponse.findUnique({ where: { id: req.params.id } });
  if (!existing) throw notFound("canned_not_found");

  const body = req.body ?? {};
  const data: { title?: string; body?: string; category?: string } = {};
  if (body.title !== undefined) data.title = requireString(body.title, "invalid_input");
  if (body.body !== undefined) data.body = requireString(body.body, "invalid_input");
  if (body.category !== undefined) data.category = normalizeCategory(body.category);

  const canned = await prisma.cannedResponse.update({ where: { id: existing.id }, data });
  res.json({ canned: serializeCannedResponse(canned) });
});

// DELETE /api/canned/:id — remove a macro.
cannedRouter.delete("/:id", async (req, res) => {
  const existing = await prisma.cannedResponse.findUnique({ where: { id: req.params.id } });
  if (!existing) throw notFound("canned_not_found");
  await prisma.cannedResponse.delete({ where: { id: existing.id } });
  res.json({ ok: true });
});
