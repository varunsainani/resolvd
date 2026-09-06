// Shared response envelopes used across the API.

export interface PageMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

// List endpoints return { data, meta }.
export interface Paginated<T> {
  data: T[];
  meta: PageMeta;
}

// Simple { data } list (agents, tags) with no pagination.
export interface Listed<T> {
  data: T[];
}
