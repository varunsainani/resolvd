import type { CannedResponse, Paginated } from "@/types";
import { api, toQuery } from "./client";

export interface CannedListParams {
  q?: string;
  category?: string;
  sort?: string;
  page?: number;
  pageSize?: number;
}

export interface CannedBody {
  title: string;
  body: string;
  category?: string;
}

export const cannedApi = {
  list: (params?: CannedListParams) =>
    api.get<Paginated<CannedResponse>>(`/canned${toQuery(params as Record<string, string | number>)}`),
  get: (id: string) => api.get<{ canned: CannedResponse }>(`/canned/${id}`),
  create: (body: CannedBody) => api.post<{ canned: CannedResponse }>("/canned", body),
  update: (id: string, body: Partial<CannedBody>) =>
    api.patch<{ canned: CannedResponse }>(`/canned/${id}`, body),
  remove: (id: string) => api.del<{ ok: boolean }>(`/canned/${id}`),
};
