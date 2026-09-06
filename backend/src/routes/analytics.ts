import { Router } from "express";

import { requireUser } from "../middleware/auth";
import { computeAnalytics } from "../services/analytics";

export const analyticsRouter = Router();

analyticsRouter.use(requireUser);

// GET /api/analytics/overview — every number the dashboard renders in one call:
// totals, SLA breach counts, average response/resolution times, and the
// status/priority/channel/category/sentiment breakdowns plus a daily trend.
analyticsRouter.get("/overview", async (_req, res) => {
  res.json(await computeAnalytics(new Date()));
});
