import type { Customer } from "./customer";
import type {
  AuthorType,
  Channel,
  Sentiment,
  SlaStateValue,
  TicketPriority,
  TicketStatus,
} from "./enums";
import type { AgentRef } from "./user";

// One SLA milestone (first response or resolution).
export interface SlaMilestone {
  dueAt: string | null;
  state: SlaStateValue;
  minutesRemaining: number | null;
}

export interface SlaBlock {
  firstResponse: SlaMilestone;
  resolution: SlaMilestone;
}

export interface Tag {
  name: string;
  color: string;
}

// Inbox list row (serializeTicketRow).
export interface TicketRow {
  id: string;
  reference: number;
  subject: string;
  status: TicketStatus;
  priority: TicketPriority;
  channel: Channel;
  category: string;
  sentiment: Sentiment;
  aiTriaged: boolean;
  customer: Customer | null;
  assignee: AgentRef | null;
  tags: Tag[];
  messageCount: number;
  createdAt: string;
  updatedAt: string;
  sla: SlaBlock;
}

export interface Message {
  id: string;
  authorType: AuthorType;
  author: AgentRef | null;
  body: string;
  isInternal: boolean;
  createdAt: string;
}

// Full ticket detail (serializeTicketDetail) = row + summary + thread.
export interface TicketDetail extends TicketRow {
  summary: string | null;
  firstResponseAt: string | null;
  resolvedAt: string | null;
  messages: Message[];
}

// Trimmed customer-facing view (serializePublicTicket).
export interface PublicTicket {
  reference: number;
  subject: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: string;
  sentiment: Sentiment;
  summary: string | null;
  aiTriaged: boolean;
  createdAt: string;
}
