"use client";

import { useTranslations } from "next-intl";

import { PageHeader } from "@/components/shell/page-header";
import { PreferencesForm } from "./preferences-form";
import { ProfileForm } from "./profile-form";

// The settings home: profile (name/email/role) and preferences (language/theme).
export function SettingsView() {
  const t = useTranslations("settings");
  return (
    <>
      <PageHeader title={t("title")} description={t("subtitle")} />
      <div className="max-w-2xl space-y-6">
        <ProfileForm />
        <PreferencesForm />
      </div>
    </>
  );
}
