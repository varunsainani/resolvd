// Pure, database-free helpers for the analytics dashboard. Keeping the maths
// here (rather than inline in the service) lets the tricky bits — rounding,
// null handling, the zero-filled day window — be unit tested without a DB.

// Round a part/total ratio to a whole percentage. A zero or negative total
// reads as 0% rather than dividing by zero.
export function percentage(part: number, total: number): number {
  if (!total || total <= 0) return 0;
  return Math.round((part / total) * 100);
}

// Average gap in whole minutes between paired start/end timestamps. Pairs with
// a missing end (a ticket not yet responded to or resolved) are skipped, and a
// negative span is ignored as bad data. Returns null when nothing qualifies so
// the UI can show a dash instead of a misleading zero.
export function averageMinutes(
  pairs: Array<{ start: Date | null; end: Date | null }>,
): number | null {
  const spans: number[] = [];
  for (const { start, end } of pairs) {
    if (!start || !end) continue;
    const mins = (end.getTime() - start.getTime()) / 60000;
    if (mins >= 0) spans.push(mins);
  }
  if (spans.length === 0) return null;
  const sum = spans.reduce((a, b) => a + b, 0);
  return Math.round(sum / spans.length);
}

// UTC calendar-day key (YYYY-MM-DD) so buckets are deterministic regardless of
// the server timezone.
export function dayKeyUTC(d: Date): string {
  return d.toISOString().slice(0, 10);
}

// Build a chronological, zero-filled count series for the last `days` calendar
// days (UTC), ending on the day of `now`. Every day in the window is present so
// the chart never has gaps; dates outside the window are ignored.
export function bucketByDay(
  dates: Date[],
  days: number,
  now: Date,
): Array<{ date: string; count: number }> {
  const series: Array<{ date: string; count: number }> = [];
  const index = new Map<string, number>();
  const end = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  for (let i = days - 1; i >= 0; i--) {
    const key = dayKeyUTC(new Date(end - i * 86_400_000));
    index.set(key, series.length);
    series.push({ date: key, count: 0 });
  }
  for (const d of dates) {
    const at = index.get(dayKeyUTC(d));
    if (at !== undefined) series[at].count += 1;
  }
  return series;
}

// Whether an SLA milestone is breached: completed after its deadline, or still
// open with the deadline already in the past. No deadline set reads as not
// breached (nothing to miss).
export function slaBreached(dueAt: Date | null, doneAt: Date | null, now: Date): boolean {
  if (!dueAt) return false;
  if (doneAt) return doneAt.getTime() > dueAt.getTime();
  return now.getTime() > dueAt.getTime();
}

// Count occurrences of each value.
export function tally(values: string[]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const v of values) out[v] = (out[v] || 0) + 1;
  return out;
}

// Project a tally over a fixed, ordered key set so every key appears (zero
// filled). Values outside `keys` are dropped, keeping the output shape stable
// for the frontend regardless of what the data happens to contain.
export function tallyToArray(
  counts: Record<string, number>,
  keys: readonly string[],
): Array<{ key: string; count: number }> {
  return keys.map((key) => ({ key, count: counts[key] || 0 }));
}
