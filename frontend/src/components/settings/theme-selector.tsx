"use client";

import { Monitor, Moon, Sun, type LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { useAuth } from "@/components/auth/auth-provider";
import { useTheme, type Theme } from "@/components/theme/theme-provider";
import { cn } from "@/lib/cn";

const OPTIONS: { value: Theme; icon: LucideIcon; labelKey: string }[] = [
  { value: "light", icon: Sun, labelKey: "themeLight" },
  { value: "dark", icon: Moon, labelKey: "themeDark" },
  { value: "system", icon: Monitor, labelKey: "themeSystem" },
];

// Segmented light/dark/system control. Applies instantly via the theme provider
// and persists the choice to the profile as a best effort.
export function ThemeSelector() {
  const t = useTranslations("settings");
  const { theme, setTheme } = useTheme();
  const { updateProfile } = useAuth();

  function choose(next: Theme) {
    setTheme(next);
    updateProfile({ theme: next }).catch(() => {});
  }

  return (
    <div className="inline-flex rounded-lg border border-border p-1">
      {OPTIONS.map((option) => {
        const active = theme === option.value;
        const Icon = option.icon;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => choose(option.value)}
            aria-pressed={active}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className="h-4 w-4" />
            {t(option.labelKey)}
          </button>
        );
      })}
    </div>
  );
}
