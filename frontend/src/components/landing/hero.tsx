import { Sparkles } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

import { InboxPreview } from "./inbox-preview";
import { LandingDemoCta } from "./landing-demo-cta";

export async function Hero() {
  const t = await getTranslations("landing.hero");
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 md:px-6 lg:grid-cols-2 lg:py-24">
      <div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
          <Sparkles className="h-3.5 w-3.5" />
          {t("badge")}
        </span>
        <h1 className="mt-5 font-display text-4xl font-extrabold leading-tight tracking-tight text-foreground sm:text-5xl">
          {t("title")}
        </h1>
        <p className="mt-5 max-w-xl text-lg text-muted-foreground">{t("subtitle")}</p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <LandingDemoCta label={t("primaryCta")} size="lg" />
          <Link
            href="/login"
            className="inline-flex h-11 items-center rounded-md border border-border px-6 text-base font-medium text-foreground hover:bg-muted"
          >
            {t("secondaryCta")}
          </Link>
        </div>
      </div>
      <div className="lg:pl-6">
        <InboxPreview />
      </div>
    </section>
  );
}
