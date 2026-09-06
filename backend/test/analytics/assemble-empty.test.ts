import { describe, expect, it } from "vitest";

import { assembleAnalytics } from "../../src/services/analytics";

const now = new Date("2026-01-10T12:00:00Z");
const result = assembleAnalytics([], now);

describe("assembleAnalytics with no tickets", () => {
  it("reports zeroed totals and rates without dividing by zero", () => {
    expect(result.totals).toEqual({
      total: 0,
      open: 0,
      unassigned: 0,
      resolved: 0,
      resolutionRate: 0,
      aiTriagedPercent: 0,
    });
  });

  it("has no SLA breaches", () => {
    expect(result.sla).toEqual({
      firstResponseBreaches: 0,
      resolutionBreaches: 0,
      breachPercent: 0,
    });
  });

  it("returns null average times (a dash in the UI, not a false zero)", () => {
    expect(result.responseTimes.avgFirstResponseMinutes).toBeNull();
    expect(result.responseTimes.avgResolutionMinutes).toBeNull();
  });

  it("still emits a full zero-filled trend window", () => {
    expect(result.trend).toHaveLength(14);
    expect(result.trend.every((e) => e.count === 0)).toBe(true);
  });

  it("zero-fills every breakdown key", () => {
    expect(result.byStatus.every((e) => e.count === 0)).toBe(true);
    expect(result.byPriority.every((e) => e.count === 0)).toBe(true);
  });
});
