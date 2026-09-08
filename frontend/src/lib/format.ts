// Locale-aware formatting helpers shared across the UI. All take an explicit
// locale so server and client render identically.

// A short absolute date, e.g. "Sep 6, 2026".
export function formatDate(iso: string | Date, locale = "en"): string {
  const d = typeof iso === "string" ? new Date(iso) : iso;
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(d);
}

// Date + time, e.g. "Sep 6, 2026, 3:04 PM".
export function formatDateTime(iso: string | Date, locale = "en"): string {
  const d = typeof iso === "string" ? new Date(iso) : iso;
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(d);
}

// Compact relative time from now, e.g. "3h ago", "in 2d". Picks the largest
// unit that fits so timestamps stay glanceable in the inbox.
export function formatRelativeTime(iso: string | Date, locale = "en", now: Date = new Date()): string {
  const d = typeof iso === "string" ? new Date(iso) : iso;
  const diffSec = Math.round((d.getTime() - now.getTime()) / 1000);
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto", style: "narrow" });
  const abs = Math.abs(diffSec);
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 31_536_000],
    ["month", 2_592_000],
    ["week", 604_800],
    ["day", 86_400],
    ["hour", 3_600],
    ["minute", 60],
  ];
  for (const [unit, secs] of units) {
    if (abs >= secs) return rtf.format(Math.round(diffSec / secs), unit);
  }
  return rtf.format(diffSec, "second");
}

// A minute count as a compact duration, e.g. 135 -> "2h 15m", 40 -> "40m",
// 3000 -> "2d 2h". Used for SLA countdowns and average response times.
export function formatDuration(totalMinutes: number): string {
  const mins = Math.max(0, Math.round(totalMinutes));
  const d = Math.floor(mins / 1440);
  const h = Math.floor((mins % 1440) / 60);
  const m = mins % 60;
  const parts: string[] = [];
  if (d) parts.push(`${d}d`);
  if (h) parts.push(`${h}h`);
  if (m || parts.length === 0) parts.push(`${m}m`);
  return parts.slice(0, 2).join(" ");
}

// A whole number with locale grouping, e.g. 1234 -> "1,234".
export function formatNumber(value: number, locale = "en"): string {
  return new Intl.NumberFormat(locale).format(value);
}

// A compact day label for chart axes, e.g. "2026-09-06" -> "Sep 6". Parsed and
// formatted in UTC so the day never shifts across timezones (the backend emits
// UTC calendar-day keys).
export function formatDayLabel(dayKey: string, locale = "en"): string {
  const d = new Date(`${dayKey}T00:00:00Z`);
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(d);
}

// Initials for an avatar fallback, e.g. "Dana Ruiz" -> "DR".
export function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}
