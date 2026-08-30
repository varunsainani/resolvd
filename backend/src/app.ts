import cors from "cors";
import express, { type NextFunction, type Request, type Response } from "express";
import "express-async-errors";

import { config } from "./config";
import { t } from "./i18n";
import { locale } from "./middleware/auth";

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: config.corsOrigin === "*" ? true : config.corsOrigin.split(","),
      credentials: true,
    }),
  );
  // locale before express.json so body-parser errors still get a localized message
  app.use(locale);
  app.use(express.json({ limit: "1mb" }));

  app.get("/health", (_req, res) => {
    res.json({ ok: true, service: "resolvd-api" });
  });

  // JSON error handler (body-parser errors, unexpected async throws)
  app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
    const status = typeof err?.status === "number" ? err.status : 500;
    const key = status >= 500 ? "server_error" : "invalid_input";
    if (status >= 500) {
      // eslint-disable-next-line no-console
      console.error("[resolvd] unhandled error:", err?.message || err);
    }
    res.status(status).json({ detail: t(key, req.locale || "en") });
  });

  return app;
}
