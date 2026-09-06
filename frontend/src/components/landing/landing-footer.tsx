import { getTranslations } from "next-intl/server";

import { Brand } from "@/components/shell/brand";

export async function LandingFooter() {
  const t = await getTranslations("landing.footer");
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-muted-foreground md:flex-row md:px-6">
        <Brand />
        <p>{t("built")}</p>
      </div>
    </footer>
  );
}
