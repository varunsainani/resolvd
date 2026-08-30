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

export const CHANNELS = ["EMAIL", "CHAT", "WEB", "PHONE"] as const;
export type ChannelValue = (typeof CHANNELS)[number];

export const SENTIMENTS = ["POSITIVE", "NEUTRAL", "NEGATIVE"] as const;
export type SentimentValue = (typeof SENTIMENTS)[number];

export function isChannel(v: unknown): v is ChannelValue {
  return typeof v === "string" && (CHANNELS as readonly string[]).includes(v);
}

// Support categories the AI can triage a ticket into.
export const CATEGORIES = [
  "General",
  "Billing",
  "Technical",
  "Account",
  "Bug",
  "Feature Request",
  "Onboarding",
  "Integration",
] as const;
export type CategoryValue = (typeof CATEGORIES)[number];

export function normalizeCategory(v: unknown): CategoryValue {
  if (typeof v === "string") {
    const match = CATEGORIES.find((c) => c.toLowerCase() === v.toLowerCase().trim());
    if (match) return match;
  }
  return "General";
}
