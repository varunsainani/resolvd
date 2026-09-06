// Enum unions mirroring the backend Prisma enums and SLA states.
export type TicketStatus = "OPEN" | "PENDING" | "RESOLVED" | "CLOSED";
export type TicketPriority = "LOW" | "NORMAL" | "HIGH" | "URGENT";
export type Channel = "EMAIL" | "CHAT" | "WEB" | "PHONE";
export type Sentiment = "POSITIVE" | "NEUTRAL" | "NEGATIVE";
export type AuthorType = "CUSTOMER" | "AGENT" | "SYSTEM";
export type Role = "admin" | "agent";

// SLA milestone state as returned by serializeSla.
export type SlaStateValue = "met" | "ok" | "due-soon" | "breached" | "none";

export const TICKET_STATUSES: TicketStatus[] = ["OPEN", "PENDING", "RESOLVED", "CLOSED"];
export const TICKET_PRIORITIES: TicketPriority[] = ["LOW", "NORMAL", "HIGH", "URGENT"];
export const CHANNELS: Channel[] = ["EMAIL", "CHAT", "WEB", "PHONE"];
export const SENTIMENTS: Sentiment[] = ["POSITIVE", "NEUTRAL", "NEGATIVE"];
