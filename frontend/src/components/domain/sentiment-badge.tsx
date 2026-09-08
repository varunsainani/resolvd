"use client";

import { useTranslations } from "next-intl";

import { Badge, type BadgeTone } from "@/components/ui/badge";
import type { Sentiment } from "@/types";

const TONE: Record<Sentiment, BadgeTone> = {
  POSITIVE: "success",
  NEUTRAL: "neutral",
  NEGATIVE: "danger",
};

// Customer sentiment pill from the AI triage.
export function SentimentBadge({ sentiment }: { sentiment: Sentiment }) {
  const t = useTranslations("ticket.sentiment");
  return <Badge tone={TONE[sentiment]}>{t(sentiment)}</Badge>;
}
