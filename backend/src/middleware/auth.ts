import type { NextFunction, Request, Response } from "express";

import { resolveLocale } from "../i18n";

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
