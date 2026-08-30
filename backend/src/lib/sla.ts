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
