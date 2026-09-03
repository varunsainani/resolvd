import type { Express } from "express";

import { authRouter } from "./auth";

// Mount every API router under /api. Called from createApp before the error
// handler so thrown ApiErrors bubble up to it.
export function registerRoutes(app: Express): void {
  app.use("/api/auth", authRouter);
}
