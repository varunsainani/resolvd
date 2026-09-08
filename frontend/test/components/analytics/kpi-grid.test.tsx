import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { KpiGrid } from "@/components/analytics/kpi-grid";
import type { AnalyticsOverview } from "@/types";
import { renderWithIntl } from "../../util/render";

const overview: AnalyticsOverview = {
  totals: { total: 42, open: 10, unassigned: 3, resolved: 27, resolutionRate: 64, aiTriagedPercent: 79 },
  sla: { firstResponseBreaches: 0, resolutionBreaches: 0, breachPercent: 0 },
  responseTimes: { avgFirstResponseMinutes: null, avgResolutionMinutes: null },
  byStatus: [],
  byPriority: [],
  byChannel: [],
  byCategory: [],
  bySentiment: [],
  trend: [],
};

describe("KpiGrid", () => {
  it("renders the headline totals and rate percentages", () => {
    renderWithIntl(<KpiGrid data={overview} />);
    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.getByText("64%")).toBeInTheDocument();
    expect(screen.getByText("79%")).toBeInTheDocument();
    expect(screen.getByText("Resolution rate")).toBeInTheDocument();
    expect(screen.getByText("AI triaged")).toBeInTheDocument();
  });
});
