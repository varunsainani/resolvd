import type { Customer, CustomerSummary, Paginated, TicketRow } from "@/types";
import { api, toQuery } from "./client";

export interface CustomerListParams {
  q?: string;
  sort?: string;
  page?: number;
  pageSize?: number;
}

export const customersApi = {
  list: (params?: CustomerListParams) =>
    api.get<Paginated<CustomerSummary>>(`/customers${toQuery(params as Record<string, string | number>)}`),
  get: (id: string) => api.get<{ customer: Customer; tickets: TicketRow[] }>(`/customers/${id}`),
  update: (id: string, body: { name?: string; company?: string }) =>
    api.patch<{ customer: Customer }>(`/customers/${id}`, body),
};
