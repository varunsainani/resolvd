import cors from "cors";
import express from "express";
import "express-async-errors";

import { config } from "./config";
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

  return app;
}
