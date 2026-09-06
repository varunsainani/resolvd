import { describe, expect, it } from "vitest";

import { assembleAnalytics } from "../../src/services/analytics";
import { makeTicket } from "../fixtures";

const now = new Date("2026-01-10T12:00:00Z");

// Four tickets spanning every status, priority, channel, and a mix of SLA
// outcomes, so one assertion pass exercises the whole computation.
const rows = [
  makeTicket({
    status: "OPEN",
    priority: "HIGH",
    channel: "EMAIL",
    category: "Billing",
    sentiment: "NEGATIVE",
    aiTriaged: true,
    assigneeId: null,
    createdAt: new Date("2026-01-10T00:00:00Z"),
    firstResponseAt: new Date("2026-01-10T00:30:00Z"), // 30 min, on time
    resolvedAt: null,
    slaFirstDueAt: new Date("2026-01-10T01:00:00Z"),
    slaResolveDueAt: new Date("2026-01-11T00:00:00Z"), // future, not breached
  }),
  makeTicket({
    status: "PENDING",
    priority: "URGENT",
    channel: "CHAT",
    category: "Technical",
    sentiment: "NEUTRAL",
    aiTriaged: false,
    assigneeId: "a1",
    createdAt: new Date("2026-01-09T00:00:00Z"),
    firstResponseAt: null, // never answered, past due -> breach
    resolvedAt: null,
    slaFirstDueAt: new Date("2026-01-09T00:30:00Z"),
    slaResolveDueAt: new Date("2026-01-09T04:00:00Z"), // past due -> breach
  }),
  makeTicket({
    status: "RESOLVED",
    priority: "NORMAL",
    channel: "WEB",
    category: "General",
    sentiment: "POSITIVE",
    aiTriaged: true,
    assigneeId: "a1",
    createdAt: new Date("2026-01-08T00:00:00Z"),
    firstResponseAt: new Date("2026-01-08T02:00:00Z"), // 120 min
    resolvedAt: new Date("2026-01-08T06:00:00Z"), // 360 min, late resolution
    slaFirstDueAt: new Date("2026-01-08T04:00:00Z"),
    slaResolveDueAt: new Date("2026-01-08T05:00:00Z"), // resolved after -> breach
  }),
  makeTicket({
    status: "CLOSED",
    priority: "LOW",
    channel: "PHONE",
    category: "Account",
    sentiment: "NEUTRAL",
    aiTriaged: false,
    assigneeId: null,
    createdAt: new Date("2026-01-05T00:00:00Z"),
    firstResponseAt: new Date("2026-01-05T01:00:00Z"), // 60 min
    resolvedAt: new Date("2026-01-05T02:00:00Z"), // 120 min, on time
    slaFirstDueAt: new Date("2026-01-05T08:00:00Z"),
    slaResolveDueAt: new Date("2026-01-06T00:00:00Z"),
  }),
];

const result = assembleAnalytics(rows, now);

describe("assembleAnalytics totals", () => {
  it("counts open, unassigned, resolved, and AI-triaged share", () => {
    expect(result.totals).toEqual({
      total: 4,
      open: 2,
      unassigned: 1,
      resolved: 2,
      aiTriagedPercent: 50,
    });
  });
});

describe("assembleAnalytics SLA", () => {
  it("counts first-response and resolution breaches", () => {
    expect(result.sla.firstResponseBreaches).toBe(1);
    expect(result.sla.resolutionBreaches).toBe(2);
    expect(result.sla.breachPercent).toBe(38); // 3 of 8 milestones
  });
});

describe("assembleAnalytics response times", () => {
  it("averages first response and resolution over answered tickets", () => {
    expect(result.responseTimes.avgFirstResponseMinutes).toBe(70); // (30+120+60)/3
    expect(result.responseTimes.avgResolutionMinutes).toBe(240); // (360+120)/2
  });
});

describe("assembleAnalytics breakdowns", () => {
  it("tallies status, priority, channel, sentiment over fixed key sets", () => {
    expect(result.byStatus).toEqual([
      { key: "OPEN", count: 1 },
      { key: "PENDING", count: 1 },
      { key: "RESOLVED", count: 1 },
      { key: "CLOSED", count: 1 },
    ]);
    expect(result.byPriority.find((e) => e.key === "URGENT")?.count).toBe(1);
    expect(result.byChannel.find((e) => e.key === "PHONE")?.count).toBe(1);
    expect(result.bySentiment.find((e) => e.key === "NEUTRAL")?.count).toBe(2);
  });

  it("zero-fills categories that never appear", () => {
    expect(result.byCategory.find((e) => e.key === "Billing")?.count).toBe(1);
    expect(result.byCategory.find((e) => e.key === "Integration")?.count).toBe(0);
  });
});

describe("assembleAnalytics trend", () => {
  it("emits a 14-day series covering every created ticket", () => {
    expect(result.trend).toHaveLength(14);
    expect(result.trend[result.trend.length - 1].date).toBe("2026-01-10");
    expect(result.trend.reduce((a, e) => a + e.count, 0)).toBe(4);
  });
});
