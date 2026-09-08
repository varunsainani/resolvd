import type { Message, SlaBlock, SlaMilestone, SlaStateValue, TicketStatus } from "@/types";

const SLA_SEVERITY: Record<SlaStateValue, number> = {
  breached: 4,
  "due-soon": 3,
  ok: 2,
  met: 1,
  none: 0,
};

// Pick the SLA milestone to surface on a compact row: the more urgent of the
// first-response and resolution clocks, favoring resolution on a tie.
export function pickSla(sla: SlaBlock): SlaMilestone {
  return SLA_SEVERITY[sla.resolution.state] >= SLA_SEVERITY[sla.firstResponse.state]
    ? sla.resolution
    : sla.firstResponse;
}

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
