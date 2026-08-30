import cors from "cors";
import express from "express";
import "express-async-errors";

import { config } from "./config";

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: config.corsOrigin === "*" ? true : config.corsOrigin.split(","),
      credentials: true,
    }),
  );

  app.get("/health", (_req, res) => {
    res.json({ ok: true, service: "resolvd-api" });
  });

  return app;
}
