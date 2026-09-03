// Best-effort in-memory daily counter used to cap AI suggestions in the demo.
// It resets per process (fine for a portfolio demo); a durable limiter would
// live in the database. Keys are namespaced by caller, e.g. `suggest:<userId>`.

interface Bucket {
  day: string;
  count: number;
}

const buckets = new Map<string, Bucket>();

// Calendar day (UTC) used to roll the counter over at midnight.
export function dayKey(now: Date): string {
  return now.toISOString().slice(0, 10);
}

// Register one use and report whether the caller is now OVER the limit.
// Returns true when the request should be blocked.
export function hitDailyLimit(key: string, max: number, now = new Date()): boolean {
  const day = dayKey(now);
  const bucket = buckets.get(key);
  if (!bucket || bucket.day !== day) {
    buckets.set(key, { day, count: 1 });
    return false;
  }
  if (bucket.count >= max) return true;
  bucket.count += 1;
  return false;
}

// Test hook: clear all counters.
export function resetDailyLimits(): void {
  buckets.clear();
}
