import type {
  Channel,
  Paginated,
  SuggestResult,
  TicketDetail,
  TicketPriority,
  TicketRow,
  TicketStatus,
} from "@/types";
import { api, toQuery } from "./client";

export interface TicketListParams {
  status?: TicketStatus;
  priority?: TicketPriority;
  channel?: Channel;
  assignee?: string;
  q?: string;
  sort?: string;
  page?: number;
  pageSize?: number;
}

export interface TicketCreateBody {
  subject: string;
  message: string;
  customer: { name: string; email: string; company?: string };
  channel?: Channel;
  priority?: TicketPriority;
}

export interface TicketPatchBody {
  status?: TicketStatus;
  priority?: TicketPriority;
  category?: string;
  assigneeId?: string | null;
}

export interface ReplyBody {
  body: string;
  isInternal?: boolean;
  status?: TicketStatus;
}

export const ticketsApi = {
  list: (params?: TicketListParams) =>
    api.get<Paginated<TicketRow>>(`/tickets${toQuery(params as Record<string, string | number>)}`),
  get: (id: string) => api.get<{ ticket: TicketDetail }>(`/tickets/${id}`),
  create: (body: TicketCreateBody) => api.post<{ ticket: TicketDetail }>("/tickets", body),
  update: (id: string, body: TicketPatchBody) =>
    api.patch<{ ticket: TicketDetail }>(`/tickets/${id}`, body),
  assign: (id: string, assigneeId?: string | null) =>
    api.post<{ ticket: TicketDetail }>(
      `/tickets/${id}/assign`,
      assigneeId === undefined ? undefined : { assigneeId },
    ),
  reply: (id: string, body: ReplyBody) =>
    api.post<{ ticket: TicketDetail }>(`/tickets/${id}/messages`, body),
  suggest: (id: string) => api.post<{ suggestion: SuggestResult }>(`/tickets/${id}/suggest`),
  addTag: (id: string, name: string) =>
    api.post<{ ticket: TicketDetail }>(`/tickets/${id}/tags`, { name }),
  removeTag: (id: string, name: string) =>
    api.del<{ ticket: TicketDetail }>(`/tickets/${id}/tags/${encodeURIComponent(name)}`),
};
