"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { useAuth } from "@/components/auth/auth-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { localeLabels, locales, type Locale } from "@/i18n/config";
import { setUserLocale } from "@/i18n/locale";
import { ThemeSelector } from "./theme-selector";

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <span className="text-sm font-medium text-foreground">{label}</span>
      {children}
    </div>
  );
}

// Language and theme preferences. Language writes the locale cookie (and refreshes
// so server components re-render) and persists it to the profile.
export function PreferencesForm() {
  const t = useTranslations("settings");
  const locale = useLocale();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const { updateProfile } = useAuth();

  function onLocale(event: React.ChangeEvent<HTMLSelectElement>) {
    const next = event.target.value as Locale;
    startTransition(async () => {
      await setUserLocale(next);
      updateProfile({ locale: next }).catch(() => {});
      router.refresh();
    });
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{t("preferences")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <Row label={t("language")}>
          <Select
            aria-label={t("language")}
            value={locale}
            onChange={onLocale}
            disabled={pending}
            className="w-40"
          >
            {locales.map((code) => (
              <option key={code} value={code}>
                {localeLabels[code]}
              </option>
            ))}
          </Select>
        </Row>
        <Row label={t("theme")}>
          <ThemeSelector />
        </Row>
      </CardContent>
    </Card>
  );
}
