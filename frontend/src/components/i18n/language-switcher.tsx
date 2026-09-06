"use client";

import { Languages } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { locales, localeLabels, type Locale } from "@/i18n/config";
import { setUserLocale } from "@/i18n/locale";
import { cn } from "@/lib/cn";

// Language picker. Persists the choice via the locale cookie (server action)
// then refreshes so server components re-render in the new language.
export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const t = useTranslations("common");
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function onChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const next = event.target.value as Locale;
    startTransition(async () => {
      await setUserLocale(next);
      router.refresh();
    });
  }

  return (
    <div className={cn("relative inline-flex items-center", className)}>
      <Languages className="pointer-events-none absolute left-2.5 h-4 w-4 text-muted-foreground" />
      <select
        aria-label={t("language")}
        value={locale}
        onChange={onChange}
        disabled={pending}
        className={cn(
          "h-9 appearance-none rounded-md border border-border bg-transparent pl-8 pr-8 text-sm",
          "text-foreground transition-colors hover:bg-muted focus-visible:outline-none",
          "disabled:opacity-60",
        )}
      >
        {locales.map((code) => (
          <option key={code} value={code} className="bg-popover text-popover-foreground">
            {localeLabels[code]}
          </option>
        ))}
      </select>
    </div>
  );
}
