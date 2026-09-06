"use client";

import { LogOut, Settings as SettingsIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { useAuth } from "@/components/auth/auth-provider";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/cn";

// Avatar button that opens a small menu with profile and sign-out. Closes on
// outside click or Escape.
export function UserMenu() {
  const { user, logout } = useAuth();
  const t = useTranslations();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!user) return null;

  const signOut = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full transition-opacity hover:opacity-90"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <Avatar name={user.name} color={user.avatarColor} size="sm" />
      </button>

      {open && (
        <div
          role="menu"
          className={cn(
            "absolute right-0 top-11 z-40 w-56 overflow-hidden rounded-lg border border-border",
            "bg-popover text-popover-foreground shadow-lg",
          )}
        >
          <div className="border-b border-border px-4 py-3">
            <p className="truncate text-sm font-semibold">{user.name}</p>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          </div>
          <div className="p-1">
            <Link
              href="/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground hover:bg-muted"
              role="menuitem"
            >
              <SettingsIcon className="h-4 w-4" />
              {t("nav.settings")}
            </Link>
            <button
              type="button"
              onClick={signOut}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-danger hover:bg-muted"
              role="menuitem"
            >
              <LogOut className="h-4 w-4" />
              {t("common.signOut")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
