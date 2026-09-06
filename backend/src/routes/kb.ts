import { Router } from "express";

import { normalizeCategory } from "../lib/constants";
import { notFound } from "../lib/http";
import { buildPageMeta, parsePageParams } from "../lib/pagination";
import { serializeKbArticle } from "../lib/serialize";
import { optionalString, requireString } from "../lib/validate";
import { requireUser } from "../middleware/auth";
import { prisma } from "../prisma";
import { kbOrderBy, kbSearchWhere } from "../services/kb";

export const kbRouter = Router();

kbRouter.use(requireUser);

// GET /api/kb — searchable, category-filterable, paginated article list.
kbRouter.get("/", async (req, res) => {
  const q = req.query as Record<string, unknown>;
  const where = kbSearchWhere(
    typeof q.q === "string" ? q.q : "",
    typeof q.category === "string" ? q.category : undefined,
  );
  const page = parsePageParams(q);

  const [total, rows] = await Promise.all([
    prisma.kbArticle.count({ where }),
    prisma.kbArticle.findMany({
      where,
      orderBy: kbOrderBy(q.sort),
      skip: page.skip,
      take: page.take,
    }),
  ]);

  res.json({ data: rows.map(serializeKbArticle), meta: buildPageMeta(total, page) });
});

// GET /api/kb/:id — a single article.
kbRouter.get("/:id", async (req, res) => {
  const article = await prisma.kbArticle.findUnique({ where: { id: req.params.id } });
  if (!article) throw notFound("article_not_found");
  res.json({ article: serializeKbArticle(article) });
});

// POST /api/kb — publish a new article. Keywords power the AI grounding search.
kbRouter.post("/", async (req, res) => {
  const body = req.body ?? {};
  const article = await prisma.kbArticle.create({
    data: {
      title: requireString(body.title, "invalid_input"),
      body: requireString(body.body, "invalid_input"),
      category: normalizeCategory(body.category),
      keywords: optionalString(body.keywords) ?? "",
    },
  });
  res.status(201).json({ article: serializeKbArticle(article) });
});

// PATCH /api/kb/:id — edit any field of an article.
kbRouter.patch("/:id", async (req, res) => {
  const existing = await prisma.kbArticle.findUnique({ where: { id: req.params.id } });
  if (!existing) throw notFound("article_not_found");

  const body = req.body ?? {};
  const data: { title?: string; body?: string; category?: string; keywords?: string } = {};
  if (body.title !== undefined) data.title = requireString(body.title, "invalid_input");
  if (body.body !== undefined) data.body = requireString(body.body, "invalid_input");
  if (body.category !== undefined) data.category = normalizeCategory(body.category);
  if (body.keywords !== undefined) data.keywords = optionalString(body.keywords) ?? "";

  const article = await prisma.kbArticle.update({ where: { id: existing.id }, data });
  res.json({ article: serializeKbArticle(article) });
});

// DELETE /api/kb/:id — retire an article.
kbRouter.delete("/:id", async (req, res) => {
  const existing = await prisma.kbArticle.findUnique({ where: { id: req.params.id } });
  if (!existing) throw notFound("article_not_found");
  await prisma.kbArticle.delete({ where: { id: existing.id } });
  res.json({ ok: true });
});
