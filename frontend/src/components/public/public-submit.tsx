"use client";

import { Headset } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import type { PublicTicket } from "@/types";
import { SubmitForm } from "./submit-form";
import { SubmitSuccess } from "./submit-success";
import { TrackForm } from "./track-form";

// The full public help page: a lightweight header, then either the submit/track
// tabs or the post-submission confirmation.
export function PublicSubmit() {
  const t = useTranslations("submit");
  const [tab, setTab] = useState("submit");
  const [submitted, setSubmitted] = useState<PublicTicket | null>(null);

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Headset className="h-4 w-4" />
          </span>
          <span className="font-display text-lg font-extrabold tracking-tight text-foreground">
            Resolvd
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {t("signIn")}
          </Link>
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto w-full max-w-xl flex-1 px-4 pb-16 pt-6">
        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold text-foreground">{t("title")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>

        {submitted ? (
          <SubmitSuccess ticket={submitted} onReset={() => setSubmitted(null)} />
        ) : (
          <>
            <Tabs
              tabs={[
                { value: "submit", label: t("tabSubmit") },
                { value: "track", label: t("tabTrack") },
              ]}
              value={tab}
              onChange={setTab}
              className="mb-4"
            />
            <Card>
              <CardContent className="p-6">
                {tab === "submit" ? (
                  <SubmitForm onSuccess={setSubmitted} />
                ) : (
                  <TrackForm />
                )}
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  );
}
