"use client";

import { useLocale } from "next-intl";

import { Avatar } from "@/components/ui/avatar";
import { formatDateTime } from "@/lib/format";
import type { Message } from "@/types";

// Customer messages use a neutral slate avatar; agent messages carry the agent's
// own color.
const CUSTOMER_COLOR = "#64748b";

// Author line above a message bubble: avatar, name, and an absolute timestamp.
export function MessageAuthor({
  message,
  customerName,
}: {
  message: Message;
  customerName: string;
}) {
  const locale = useLocale();
  const isAgent = message.authorType === "AGENT";
  const name = isAgent ? (message.author?.name ?? customerName) : customerName;
  const color = isAgent ? message.author?.avatarColor : CUSTOMER_COLOR;

  return (
    <div className="flex items-center gap-2">
      <Avatar name={name} color={color} size="sm" />
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-foreground">{name}</p>
        <p className="text-xs text-muted-foreground">{formatDateTime(message.createdAt, locale)}</p>
      </div>
    </div>
  );
}
