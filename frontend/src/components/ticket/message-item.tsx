"use client";

import { Lock } from "lucide-react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/cn";
import { isInbound } from "@/lib/ticket-format";
import type { Message } from "@/types";
import { MessageAuthor } from "./message-author";

// One conversation message. Customer messages sit left with a muted bubble,
// agent replies sit right in the brand color, and internal notes get a distinct
// amber treatment on the agent side with a lock marker.
export function MessageItem({
  message,
  customerName,
}: {
  message: Message;
  customerName: string;
}) {
  const t = useTranslations("ticketDetail.thread");
  const inbound = isInbound(message);

  return (
    <div className={cn("flex flex-col gap-2", inbound ? "items-start" : "items-end")}>
      <MessageAuthor message={message} customerName={customerName} />
      <div
        className={cn(
          "max-w-[85%] whitespace-pre-wrap rounded-lg px-4 py-3 text-sm leading-relaxed",
          message.isInternal
            ? "border border-warning/40 bg-warning-soft text-foreground"
            : inbound
              ? "bg-muted text-foreground"
              : "bg-primary text-primary-foreground",
        )}
      >
        {message.isInternal && (
          <span className="mb-1.5 flex items-center gap-1 text-xs font-medium text-warning">
            <Lock className="h-3 w-3" />
            {t("internal")}
          </span>
        )}
        {message.body}
      </div>
    </div>
  );
}
