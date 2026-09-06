import type { Express } from "express";

import { adminRouter } from "./admin";
import { agentsRouter } from "./agents";
import { analyticsRouter } from "./analytics";
import { authRouter } from "./auth";
import { cannedRouter } from "./canned";
import { customersRouter } from "./customers";
import { kbRouter } from "./kb";
import { messagesRouter } from "./messages";
import { publicRouter } from "./public";
import { ticketsRouter } from "./tickets";

// Mount every API router under /api. Called from createApp before the error
// handler so thrown ApiErrors bubble up to it.
export function registerRoutes(app: Express): void {
  app.use("/api/auth", authRouter);
  app.use("/api/tickets", ticketsRouter);
  // Conversation actions (reply, AI suggest) hang off a specific ticket.
  app.use("/api/tickets/:ticketId", messagesRouter);
  app.use("/api/customers", customersRouter);
  app.use("/api/kb", kbRouter);
  app.use("/api/canned", cannedRouter);
  app.use("/api/analytics", analyticsRouter);
  app.use("/api/agents", agentsRouter);
  app.use("/api/admin", adminRouter);
  // Unauthenticated customer-facing endpoints (submit form, status lookup).
  app.use("/api/public", publicRouter);
}
