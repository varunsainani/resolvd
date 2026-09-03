import { Router } from "express";

import { hashPassword, signToken, verifyPassword } from "../auth";
import { ApiError } from "../lib/http";
import { serializeUser } from "../lib/serialize";
import { requireEmail, requirePassword, requireString } from "../lib/validate";
import { requireUser } from "../middleware/auth";
import { prisma } from "../prisma";

export const authRouter = Router();

// Shape returned by every endpoint that authenticates a user.
function authPayload(user: Parameters<typeof serializeUser>[0]) {
  return { token: signToken(user.id, user.role), user: serializeUser(user) };
}

// POST /api/auth/signup — register a new agent account.
authRouter.post("/signup", async (req, res) => {
  const body = req.body ?? {};
  const name = requireString(body.name, "name_required");
  const email = requireEmail(body.email);
  const password = requirePassword(body.password);

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new ApiError(409, "email_taken");
  }

  const user = await prisma.user.create({
    data: { name, email, passwordHash: await hashPassword(password) },
  });
  res.status(201).json(authPayload(user));
});
