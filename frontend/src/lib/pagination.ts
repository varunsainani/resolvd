export type PageToken = number | "ellipsis";

// Build the page tokens for a pagination control: always the first and last
// page, a window of `siblings` around the current page, and "ellipsis" markers
// where pages are skipped. Pure, so the windowing logic is unit tested.
export function pageRange(current: number, total: number, siblings = 1): PageToken[] {
  if (total <= 1) return total === 1 ? [1] : [];

  const left = Math.max(2, current - siblings);
  const right = Math.min(total - 1, current + siblings);
  const tokens: PageToken[] = [1];

  if (left > 2) tokens.push("ellipsis");
  for (let page = left; page <= right; page++) tokens.push(page);
  if (right < total - 1) tokens.push("ellipsis");

  tokens.push(total);
  return tokens;
}
