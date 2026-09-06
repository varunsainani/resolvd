import { BarChart3, Globe, Inbox, MessageSquareQuote, Timer, Wand2 } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { FeatureCard } from "./feature-card";

const FEATURES = [
  { icon: Wand2, key: "triage" },
  { icon: MessageSquareQuote, key: "reply" },
  { icon: Timer, key: "sla" },
  { icon: Inbox, key: "inbox" },
  { icon: BarChart3, key: "analytics" },
  { icon: Globe, key: "public" },
] as const;

export async function FeatureGrid() {
  const t = await getTranslations("landing.features");
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-3xl font-bold text-foreground">{t("title")}</h2>
        <p className="mt-3 text-muted-foreground">{t("subtitle")}</p>
      </div>
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f) => (
          <FeatureCard
            key={f.key}
            icon={f.icon}
            title={t(`${f.key}Title`)}
            body={t(`${f.key}Body`)}
          />
        ))}
      </div>
    </section>
  );
}
