import { Router } from "express";

import { serializeUser } from "../lib/serialize";
import { requireUser } from "../middleware/auth";
import { prisma } from "../prisma";

export const agentsRouter = Router();

agentsRouter.use(requireUser);

// GET /api/agents — the team roster for the assignee picker. Any authenticated
// agent can read it (assigning a ticket to a teammate needs the full list);
// creating and removing members lives under the admin routes.
agentsRouter.get("/", async (_req, res) => {
  const users = await prisma.user.findMany({ orderBy: { name: "asc" } });
  res.json({ data: users.map(serializeUser) });
});
