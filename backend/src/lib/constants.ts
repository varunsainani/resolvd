export const TICKET_STATUSES = ["OPEN", "PENDING", "RESOLVED", "CLOSED"] as const;
export type TicketStatusValue = (typeof TICKET_STATUSES)[number];

export const TICKET_PRIORITIES = ["LOW", "NORMAL", "HIGH", "URGENT"] as const;
export type TicketPriorityValue = (typeof TICKET_PRIORITIES)[number];

export function isTicketStatus(v: unknown): v is TicketStatusValue {
  return typeof v === "string" && (TICKET_STATUSES as readonly string[]).includes(v);
}

export function isTicketPriority(v: unknown): v is TicketPriorityValue {
  return typeof v === "string" && (TICKET_PRIORITIES as readonly string[]).includes(v);
}
