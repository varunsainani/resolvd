// Fill colors for the analytics breakdown bars, matched to the same tones the
// status/priority/sentiment badges use elsewhere so the dashboard reads
// consistently at a glance.
export type BreakdownDimension = "status" | "priority" | "channel" | "sentiment" | "category";

const STATUS: Record<string, string> = {
  OPEN: "bg-info",
  PENDING: "bg-warning",
  RESOLVED: "bg-success",
  CLOSED: "bg-muted-foreground",
};

const PRIORITY: Record<string, string> = {
  LOW: "bg-muted-foreground",
  NORMAL: "bg-info",
  HIGH: "bg-warning",
  URGENT: "bg-danger",
};

const SENTIMENT: Record<string, string> = {
  POSITIVE: "bg-success",
  NEUTRAL: "bg-muted-foreground",
  NEGATIVE: "bg-danger",
};

const MAPS: Partial<Record<BreakdownDimension, Record<string, string>>> = {
  status: STATUS,
  priority: PRIORITY,
  sentiment: SENTIMENT,
};

// Bar color class for a breakdown entry. Channel and category share the neutral
// brand color; the others follow their badge tone. Unknown keys fall back to the
// brand color so a bar is never invisible.
export function breakdownColor(dimension: BreakdownDimension, key: string): string {
  return MAPS[dimension]?.[key] ?? "bg-primary";
}
