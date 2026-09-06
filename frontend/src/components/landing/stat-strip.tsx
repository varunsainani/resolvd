import { Check } from "lucide-react";
import { getTranslations } from "next-intl/server";

// Thin band of quick proof points below the hero.
export async function StatStrip() {
  const t = await getTranslations("landing.stats");
  const items = [t("triage"), t("sla"), t("languages")];
  return (
    <div className="border-y border-border bg-card">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-2 px-4 py-4 text-sm font-medium text-muted-foreground md:px-6">
        {items.map((item) => (
          <span key={item} className="inline-flex items-center gap-2">
            <Check className="h-4 w-4 text-primary" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
