"use client";

import { useLocale } from "next-intl";

import { formatRelativeTime } from "@/lib/format";
import type { Message } from "@/types";

// A system event (e.g. status change) rendered as a centered, muted note rather
// than a conversation bubble.
export function SystemEvent({ message }: { message: Message }) {
  const locale = useLocale();
  return (
    <div className="flex items-center justify-center py-1">
      <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
        {message.body} · {formatRelativeTime(message.createdAt, locale)}
      </span>
    </div>
  );
}
