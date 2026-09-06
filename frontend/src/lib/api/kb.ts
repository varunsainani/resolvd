import type { KbArticle, Paginated } from "@/types";
import { api, toQuery } from "./client";

export interface KbListParams {
  q?: string;
  category?: string;
  sort?: string;
  page?: number;
  pageSize?: number;
}

export interface KbBody {
  title: string;
  body: string;
  category?: string;
  keywords?: string;
}

export const kbApi = {
  list: (params?: KbListParams) =>
    api.get<Paginated<KbArticle>>(`/kb${toQuery(params as Record<string, string | number>)}`),
  get: (id: string) => api.get<{ article: KbArticle }>(`/kb/${id}`),
  create: (body: KbBody) => api.post<{ article: KbArticle }>("/kb", body),
  update: (id: string, body: Partial<KbBody>) => api.patch<{ article: KbArticle }>(`/kb/${id}`, body),
  remove: (id: string) => api.del<{ ok: boolean }>(`/kb/${id}`),
};
