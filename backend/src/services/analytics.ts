import type { Ticket } from "@prisma/client";

import {
  averageMinutes,
  bucketByDay,
  percentage,
  slaBreached,
  tally,
  tallyToArray,
} from "../lib/analytics";
import {
  CATEGORIES,
  CHANNELS,
  SENTIMENTS,
  TICKET_PRIORITIES,
  TICKET_STATUSES,
} from "../lib/constants";
import { prisma } from "../prisma";

// Only the scalar fields the dashboard maths needs. Selecting this narrow shape
// keeps the single analytics query cheap even as the ticket table grows.
export type AnalyticsRow = Pick<
  Ticket,
  | "status"
  | "priority"
  | "channel"
  | "category"
  | "sentiment"
  | "aiTriaged"
  | "assigneeId"
  | "createdAt"
  | "firstResponseAt"
  | "resolvedAt"
  | "slaFirstDueAt"
  | "slaResolveDueAt"
>;

// Statuses that count as "still needs work" for the open/unassigned tiles.
const UNRESOLVED = new Set(["OPEN", "PENDING"]);

// Number of days shown in the "tickets over time" chart.
export const TREND_DAYS = 14;

// Assemble the full dashboard payload from in-memory rows. Pure (no DB, no
// clock of its own) so the whole computation is unit tested with fixtures.
export function assembleAnalytics(rows: AnalyticsRow[], now: Date) {
  const total = rows.length;
  const unresolved = rows.filter((r) => UNRESOLVED.has(r.status));

  const firstResponseBreaches = rows.filter((r) =>
    slaBreached(r.slaFirstDueAt, r.firstResponseAt, now),
  ).length;
  const resolutionBreaches = rows.filter((r) =>
    slaBreached(r.slaResolveDueAt, r.resolvedAt, now),
  ).length;

  return {
    totals: {
      total,
      open: unresolved.length,
      unassigned: unresolved.filter((r) => r.assigneeId == null).length,
      resolved: rows.filter((r) => r.status === "RESOLVED" || r.status === "CLOSED").length,
      aiTriagedPercent: percentage(rows.filter((r) => r.aiTriaged).length, total),
    },
    sla: {
      firstResponseBreaches,
      resolutionBreaches,
      breachPercent: percentage(firstResponseBreaches + resolutionBreaches, total * 2),
    },
    responseTimes: {
      avgFirstResponseMinutes: averageMinutes(
        rows.map((r) => ({ start: r.createdAt, end: r.firstResponseAt })),
      ),
      avgResolutionMinutes: averageMinutes(
        rows.map((r) => ({ start: r.createdAt, end: r.resolvedAt })),
      ),
    },
    byStatus: tallyToArray(tally(rows.map((r) => r.status)), TICKET_STATUSES),
    byPriority: tallyToArray(tally(rows.map((r) => r.priority)), TICKET_PRIORITIES),
    byChannel: tallyToArray(tally(rows.map((r) => r.channel)), CHANNELS),
    byCategory: tallyToArray(tally(rows.map((r) => r.category)), CATEGORIES),
    bySentiment: tallyToArray(tally(rows.map((r) => r.sentiment)), SENTIMENTS),
    trend: bucketByDay(rows.map((r) => r.createdAt), TREND_DAYS, now),
  };
}

// Load the ticket rows and assemble the dashboard. Thin wrapper so the query
// stays here and the maths stays testable in assembleAnalytics.
export async function computeAnalytics(now: Date = new Date()) {
  const rows = await prisma.ticket.findMany({
    select: {
      status: true,
      priority: true,
      channel: true,
      category: true,
      sentiment: true,
      aiTriaged: true,
      assigneeId: true,
      createdAt: true,
      firstResponseAt: true,
      resolvedAt: true,
      slaFirstDueAt: true,
      slaResolveDueAt: true,
    },
  });
  return assembleAnalytics(rows, now);
}
