import { getTranslations } from "next-intl/server";

import { ThemeToggle } from "@/components/theme/theme-toggle";

// Temporary scaffold landing. Replaced by the real landing + login in chunk 6;
// for now it verifies the design tokens, fonts, and providers render.
export default async function Home() {
  const t = await getTranslations("app");
  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center gap-6 p-8">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-8 text-center shadow-sm">
        <span className="inline-flex items-center rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
          {t("tagline")}
        </span>
        <h1 className="mt-4 text-4xl font-extrabold text-card-foreground">{t("name")}</h1>
        <p className="mt-3 text-sm text-muted-foreground">Frontend scaffold is ready.</p>
      </div>
    </main>
  );
}
