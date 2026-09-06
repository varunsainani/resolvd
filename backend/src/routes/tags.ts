import { Router } from "express";

import { serializeTagRecord } from "../lib/serialize";
import { requireUser } from "../middleware/auth";
import { prisma } from "../prisma";

export const tagsRouter = Router();

tagsRouter.use(requireUser);

// GET /api/tags — the shared tag vocabulary with usage counts, ordered by how
// often each tag is used. Feeds the filter chips and the tag picker.
tagsRouter.get("/", async (_req, res) => {
  const tags = await prisma.tag.findMany({
    include: { _count: { select: { tickets: true } } },
    orderBy: [{ tickets: { _count: "desc" } }, { name: "asc" }],
  });
  res.json({ data: tags.map(serializeTagRecord) });
});
