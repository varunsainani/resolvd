// Pure, DOM-free helpers for the analytics charts. Keeping the scaling maths
// here lets the width/height percentages be unit tested without rendering.

export interface Countable {
  count: number;
}

// Largest count across entries (0 when empty). Bars scale against this so the
// tallest bar fills the track.
export function maxCount(entries: Countable[]): number {
  return entries.reduce((max, entry) => (entry.count > max ? entry.count : max), 0);
}

// Sum of all counts.
export function totalCount(entries: Countable[]): number {
  return entries.reduce((sum, entry) => sum + entry.count, 0);
}

// A bar's length as a 0..100 percentage of the largest value. A non-positive
// max yields 0, so an all-zero series renders empty bars rather than NaN widths.
export function barPercent(value: number, max: number): number {
  if (max <= 0) return 0;
  return Math.max(0, Math.min(100, (value / max) * 100));
}

// A value's share of the total, as a 0..100 percentage (0 when total <= 0).
export function sharePercent(value: number, total: number): number {
  if (total <= 0) return 0;
  return Math.max(0, Math.min(100, (value / total) * 100));
}

// Whether a series carries any non-zero data worth charting.
export function hasData(entries: Countable[]): boolean {
  return entries.some((entry) => entry.count > 0);
}
