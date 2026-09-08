import type { Message, TicketStatus } from "@/types";

// Display form of a ticket reference number, e.g. 1042 -> "#1042".
export function referenceLabel(reference: number): string {
  return `#${reference}`;
}

// A ticket is settled once it is resolved or closed. Gates the reply composer
// and dims the thread once no further work is expected.
export function isTicketClosed(status: TicketStatus): boolean {
  return status === "RESOLVED" || status === "CLOSED";
}

// Whether a message came from the customer (vs an agent reply or a system
// event), which drives the left/right alignment of the thread bubbles.
export function isInbound(message: Pick<Message, "authorType">): boolean {
  return message.authorType === "CUSTOMER";
}
