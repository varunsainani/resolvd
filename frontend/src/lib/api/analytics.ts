import type { AnalyticsOverview } from "@/types";
import { api } from "./client";

export const analyticsApi = {
  overview: () => api.get<AnalyticsOverview>("/analytics/overview"),
};
