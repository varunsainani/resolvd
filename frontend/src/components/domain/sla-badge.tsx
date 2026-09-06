"use client";

import { useTranslations } from "next-intl";

import { Badge, type BadgeTone } from "@/components/ui/badge";
import { formatDuration } from "@/lib/format";
import type { SlaMilestone } from "@/types";

const TONE: Record<SlaMilestone["state"], BadgeTone> = {
  met: "success",
  ok: "neutral",
  "due-soon": "warning",
  breached: "danger",
  none: "neutral",
};

// SLA countdown pill. Shows "Met" once done, the remaining time while on track,
// or how far overdue once breached.
export function SlaBadge({ milestone }: { milestone: SlaMilestone }) {
  const t = useTranslations("sla");
  const { state, minutesRemaining } = milestone;

  let label: string;
  if (state === "met") label = t("met");
  else if (state === "none" || minutesRemaining === null) label = "—";
  else if (state === "breached")
    label = t("overdue", { time: formatDuration(Math.abs(minutesRemaining)) });
  else label = t("remaining", { time: formatDuration(minutesRemaining) });

  return <Badge tone={TONE[state]}>{label}</Badge>;
}
