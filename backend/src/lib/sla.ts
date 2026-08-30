import { SLA_MINUTES, TicketPriorityValue } from "./constants";

// Given a ticket priority and a start time, return the first-response and
// resolution deadlines used to drive the SLA timers in the UI.
export function computeSlaDueDates(priority: TicketPriorityValue, from: Date) {
  const cfg = SLA_MINUTES[priority];
  return {
    firstDue: new Date(from.getTime() + cfg.firstResponse * 60_000),
    resolveDue: new Date(from.getTime() + cfg.resolution * 60_000),
  };
}

export type SlaState = "met" | "ok" | "due-soon" | "breached" | "none";

// Classify an SLA milestone. `done` means the milestone was already met
// (e.g. a first response was sent, or the ticket was resolved).
export function slaState(dueAt: Date | null | undefined, now: Date, done: boolean): SlaState {
  if (done) return "met";
  if (!dueAt) return "none";
  const diffMs = dueAt.getTime() - now.getTime();
  if (diffMs < 0) return "breached";
  if (diffMs < 60 * 60_000) return "due-soon";
  return "ok";
}
