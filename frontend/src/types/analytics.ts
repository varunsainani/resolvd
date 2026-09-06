// Dashboard payload from GET /api/analytics/overview (assembleAnalytics).

export interface CountEntry {
  key: string;
  count: number;
}

export interface TrendPoint {
  date: string;
  count: number;
}

export interface AnalyticsOverview {
  totals: {
    total: number;
    open: number;
    unassigned: number;
    resolved: number;
    resolutionRate: number;
    aiTriagedPercent: number;
  };
  sla: {
    firstResponseBreaches: number;
    resolutionBreaches: number;
    breachPercent: number;
  };
  responseTimes: {
    avgFirstResponseMinutes: number | null;
    avgResolutionMinutes: number | null;
  };
  byStatus: CountEntry[];
  byPriority: CountEntry[];
  byChannel: CountEntry[];
  byCategory: CountEntry[];
  bySentiment: CountEntry[];
  trend: TrendPoint[];
}
