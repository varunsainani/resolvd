import type { NextFunction, Request, Response } from "express";

import { verifyToken } from "../auth";
import { resolveLocale, t } from "../i18n";
import { prisma } from "../prisma";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      userId?: string;
      role?: string;
      locale?: string;
      user?: { id: string; name: string; email: string; role: string; locale: string; theme: string };
    }
  }
}

export function locale(req: Request, _res: Response, next: NextFunction): void {
  req.locale = resolveLocale(req);
  next();
}

export async function requireUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7).trim() : null;
  const payload = token ? verifyToken(token) : null;
  if (!payload) {
    res.status(401).json({ detail: t("not_authenticated", req.locale) });
    return;
  }
  const user = await prisma.user.findUnique({ where: { id: payload.sub } });
  if (!user) {
    res.status(401).json({ detail: t("not_authenticated", req.locale) });
    return;
  }
  req.userId = user.id;
  req.role = user.role;
  req.user = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    locale: user.locale,
    theme: user.theme,
  };
  next();
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (req.role !== "admin") {
    res.status(403).json({ detail: t("forbidden", req.locale) });
    return;
  }
  next();
}
