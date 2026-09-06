"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useAuth } from "@/components/auth/auth-provider";
import { cn } from "@/lib/cn";
import { Brand } from "./brand";
import { NAV_ITEMS } from "./nav-items";

// Persistent left navigation (desktop). Admin-only items are hidden for agents.
export function Sidebar() {
  const pathname = usePathname();
  const t = useTranslations("nav");
  const { user } = useAuth();
  const items = NAV_ITEMS.filter((item) => !item.adminOnly || user?.role === "admin");

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-card md:flex">
      <div className="flex h-16 items-center px-5">
        <Brand />
      </div>
      <nav className="flex-1 space-y-1 px-3 py-2">
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {t(item.key)}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
