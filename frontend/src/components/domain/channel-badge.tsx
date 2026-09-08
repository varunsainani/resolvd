"use client";

import { Globe, Mail, MessageSquare, Phone, type LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/cn";
import type { Channel } from "@/types";

const ICON: Record<Channel, LucideIcon> = {
  EMAIL: Mail,
  CHAT: MessageSquare,
  WEB: Globe,
  PHONE: Phone,
};

// Channel indicator: a small icon plus the localized channel name. `iconOnly`
// drops the visible label for tight rows while keeping it for screen readers.
export function ChannelBadge({
  channel,
  iconOnly = false,
  className,
}: {
  channel: Channel;
  iconOnly?: boolean;
  className?: string;
}) {
  const t = useTranslations("ticket.channel");
  const Icon = ICON[channel];
  const label = t(channel);
  return (
    <span
      className={cn("inline-flex items-center gap-1.5 text-xs text-muted-foreground", className)}
      title={label}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      {iconOnly ? <span className="sr-only">{label}</span> : label}
    </span>
  );
}
