"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/cn";
import { useTheme, type Theme } from "./theme-provider";

const ORDER: Theme[] = ["light", "dark", "system"];
const ICON = { light: Sun, dark: Moon, system: Monitor } as const;

// Compact control that cycles light -> dark -> system. The icon reflects the
// chosen mode (not the resolved one) so "system" is always distinguishable.
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const t = useTranslations("common");
  const Icon = ICON[theme];

  const next = () => setTheme(ORDER[(ORDER.indexOf(theme) + 1) % ORDER.length]);

  return (
    <button
      type="button"
      onClick={next}
      aria-label={t("toggleTheme")}
      title={t("toggleTheme")}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-md border border-border",
        "text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
        className,
      )}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}
