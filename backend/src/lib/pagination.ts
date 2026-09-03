// Query-string pagination shared by every list endpoint. Page is 1-based.

export interface PageParams {
  page: number;
  pageSize: number;
  skip: number;
  take: number;
}

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

function toInt(value: unknown, fallback: number): number {
  const n = Number(Array.isArray(value) ? value[0] : value);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}

// Parse and clamp `page` and `pageSize` from a query object into Prisma
// skip/take. Out-of-range values fall back to safe defaults.
export function parsePageParams(query: Record<string, unknown>): PageParams {
  const page = Math.max(1, toInt(query.page, 1));
  const pageSize = Math.min(MAX_PAGE_SIZE, Math.max(1, toInt(query.pageSize, DEFAULT_PAGE_SIZE)));
  return { page, pageSize, skip: (page - 1) * pageSize, take: pageSize };
}
