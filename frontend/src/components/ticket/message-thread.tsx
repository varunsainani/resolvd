import type { TicketDetail } from "@/types";
import { MessageItem } from "./message-item";
import { SystemEvent } from "./system-event";

// The full conversation: system events render inline as centered notes, every
// other message as a customer/agent bubble.
export function MessageThread({ ticket }: { ticket: TicketDetail }) {
  const customerName = ticket.customer?.name ?? "—";

  return (
    <div className="space-y-5">
      {ticket.messages.map((message) =>
        message.authorType === "SYSTEM" ? (
          <SystemEvent key={message.id} message={message} />
        ) : (
          <MessageItem key={message.id} message={message} customerName={customerName} />
        ),
      )}
    </div>
  );
}
