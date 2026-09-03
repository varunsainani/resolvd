import { Router } from "express";

import { hashPassword, signToken, verifyPassword } from "../auth";
import { config } from "../config";
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

// POST /api/auth/login — exchange email + password for a bearer token.
authRouter.post("/login", async (req, res) => {
  const body = req.body ?? {};
  const email = requireEmail(body.email, "invalid_credentials");
  const password =
    typeof body.password === "string" ? body.password : "";

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    throw new ApiError(401, "invalid_credentials");
  }
  res.json(authPayload(user));
});

// POST /api/auth/demo — one-click sign-in to the shared demo account.
// No password: the button lets visitors explore the product instantly.
authRouter.post("/demo", async (_req, res) => {
  const user = await prisma.user.findUnique({ where: { email: config.demoEmail } });
  if (!user) {
    throw new ApiError(401, "invalid_credentials");
  }
  res.json(authPayload(user));
});
