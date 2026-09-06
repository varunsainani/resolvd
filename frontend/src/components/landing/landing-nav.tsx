import { getTranslations } from "next-intl/server";
import Link from "next/link";

import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { Brand } from "@/components/shell/brand";
import { ThemeToggle } from "@/components/theme/theme-toggle";

// Top navigation for the public landing page.
export async function LandingNav() {
  const t = await getTranslations("landing.nav");
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
        <Brand />
        <div className="flex items-center gap-2">
          <Link
            href="/submit"
            className="hidden rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground sm:block"
          >
            {t("submitTicket")}
          </Link>
          <LanguageSwitcher className="hidden sm:inline-flex" />
          <ThemeToggle />
          <Link
            href="/login"
            className="rounded-md border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
          >
            {t("signIn")}
          </Link>
        </div>
      </div>
    </header>
  );
}
