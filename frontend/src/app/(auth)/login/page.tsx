import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

import { AuthCard } from "@/components/auth/auth-card";
import { DemoButton } from "@/components/auth/demo-button";
import { LoginForm } from "@/components/auth/login-form";
import { RedirectIfAuthed } from "@/components/auth/redirect-if-authed";
import { Divider } from "@/components/ui";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("auth");
  return { title: t("signIn") };
}

export default async function LoginPage() {
  const t = await getTranslations("auth");
  return (
    <RedirectIfAuthed>
      <AuthCard
        title={t("welcomeBack")}
        subtitle={t("welcomeSubtitle")}
        footer={
          <span>
            {t("noAccount")}{" "}
            <Link href="/signup" className="font-medium text-primary hover:underline">
              {t("signUp")}
            </Link>
          </span>
        }
      >
        <LoginForm />
        <Divider label={t("or")} />
        <DemoButton />
      </AuthCard>
    </RedirectIfAuthed>
  );
}
