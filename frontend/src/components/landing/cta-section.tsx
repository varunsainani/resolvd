import { getTranslations } from "next-intl/server";

import { LandingDemoCta } from "./landing-demo-cta";

export async function CtaSection() {
  const t = await getTranslations("landing.cta");
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
      <div className="rounded-2xl bg-primary px-6 py-14 text-center text-primary-foreground">
        <h2 className="font-display text-3xl font-bold">{t("title")}</h2>
        <p className="mx-auto mt-3 max-w-xl text-primary-foreground/90">{t("subtitle")}</p>
        <div className="mt-8 flex justify-center">
          <LandingDemoCta label={t("button")} size="lg" variant="secondary" />
        </div>
      </div>
    </section>
  );
}
