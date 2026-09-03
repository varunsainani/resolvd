import type { Express } from "express";

import { authRouter } from "./auth";
import { messagesRouter } from "./messages";
import { ticketsRouter } from "./tickets";

// Mount every API router under /api. Called from createApp before the error
// handler so thrown ApiErrors bubble up to it.
export function registerRoutes(app: Express): void {
  app.use("/api/auth", authRouter);
  app.use("/api/tickets", ticketsRouter);
  // Conversation actions (reply, AI suggest) hang off a specific ticket.
  app.use("/api/tickets/:ticketId", messagesRouter);
}
