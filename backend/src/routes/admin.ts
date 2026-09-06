import { Router } from "express";

import { hashPassword } from "../auth";
import { ApiError, notFound } from "../lib/http";
import { serializeAgentSummary } from "../lib/serialize";
import { oneOf, requireEmail, requirePassword, requireString } from "../lib/validate";
import { requireAdmin, requireUser } from "../middleware/auth";
import { prisma } from "../prisma";
import { isLastAdmin } from "../services/admin";

// Team management. Admin only: the roster with per-agent workload plus create,
// update, and remove.
export const adminRouter = Router();

adminRouter.use(requireUser, requireAdmin);

const ROLES = ["admin", "agent"] as const;

// Ids of every admin, for the last-admin guard.
async function adminIds(): Promise<string[]> {
  const admins = await prisma.user.findMany({ where: { role: "admin" }, select: { id: true } });
  return admins.map((a) => a.id);
}

// GET /api/admin/agents — the full team with open and total assigned counts.
adminRouter.get("/agents", async (_req, res) => {
  const [users, totals, open] = await Promise.all([
    prisma.user.findMany({ orderBy: { name: "asc" } }),
    prisma.ticket.groupBy({
      by: ["assigneeId"],
      _count: { _all: true },
      where: { assigneeId: { not: null } },
    }),
    prisma.ticket.groupBy({
      by: ["assigneeId"],
      _count: { _all: true },
      where: { assigneeId: { not: null }, status: { in: ["OPEN", "PENDING"] } },
    }),
  ]);

  const totalBy = new Map(totals.map((r) => [r.assigneeId, r._count._all]));
  const openBy = new Map(open.map((r) => [r.assigneeId, r._count._all]));

  res.json({
    data: users.map((u) =>
      serializeAgentSummary({
        ...u,
        totalAssigned: totalBy.get(u.id) ?? 0,
        openAssigned: openBy.get(u.id) ?? 0,
      }),
    ),
  });
});

// POST /api/admin/agents — invite a new team member with an initial password.
adminRouter.post("/agents", async (req, res) => {
  const body = req.body ?? {};
  const name = requireString(body.name, "name_required");
  const email = requireEmail(body.email);
  const password = requirePassword(body.password);
  const role = body.role !== undefined ? oneOf(body.role, ROLES, "invalid_role") : "agent";

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new ApiError(409, "email_taken");

  const user = await prisma.user.create({
    data: { name, email, role, passwordHash: await hashPassword(password) },
  });
  res.status(201).json({ agent: serializeAgentSummary(user) });
});

// PATCH /api/admin/agents/:id — rename a member or change their role. Demoting
// the last admin is refused so the team can never lock itself out.
adminRouter.patch("/agents/:id", async (req, res) => {
  const target = await prisma.user.findUnique({ where: { id: req.params.id } });
  if (!target) throw notFound("agent_not_found");

  const body = req.body ?? {};
  const data: { name?: string; role?: "admin" | "agent" } = {};
  if (body.name !== undefined) data.name = requireString(body.name, "name_required");
  if (body.role !== undefined) {
    const role = oneOf(body.role, ROLES, "invalid_role");
    if (role === "agent" && target.role === "admin" && isLastAdmin(await adminIds(), target.id)) {
      throw new ApiError(400, "last_admin");
    }
    data.role = role;
  }

  const user = await prisma.user.update({ where: { id: target.id }, data });
  res.json({ agent: serializeAgentSummary(user) });
});

// DELETE /api/admin/agents/:id — remove a member. Their tickets fall back to
// unassigned (schema onDelete: SetNull). You cannot remove yourself.
adminRouter.delete("/agents/:id", async (req, res) => {
  if (req.params.id === req.userId) throw new ApiError(400, "cannot_remove_self");
  const target = await prisma.user.findUnique({ where: { id: req.params.id } });
  if (!target) throw notFound("agent_not_found");

  await prisma.user.delete({ where: { id: target.id } });
  res.json({ ok: true });
});
