import { getTranslations } from "next-intl/server";

export async function HowItWorks() {
  const t = await getTranslations("landing.how");
  const steps = [1, 2, 3].map((n) => ({
    n,
    title: t(`step${n}Title`),
    body: t(`step${n}Body`),
  }));

  return (
    <section className="border-y border-border bg-muted/40">
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <h2 className="text-center font-display text-3xl font-bold text-foreground">{t("title")}</h2>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                {s.n}
              </span>
              <h3 className="mt-4 font-semibold text-foreground">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
