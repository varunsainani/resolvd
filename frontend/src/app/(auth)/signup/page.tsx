import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

import { AuthCard } from "@/components/auth/auth-card";
import { RedirectIfAuthed } from "@/components/auth/redirect-if-authed";
import { SignupForm } from "@/components/auth/signup-form";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("auth");
  return { title: t("signUp") };
}

export default async function SignupPage() {
  const t = await getTranslations("auth");
  return (
    <RedirectIfAuthed>
      <AuthCard
        title={t("createAccount")}
        subtitle={t("createSubtitle")}
        footer={
          <span>
            {t("haveAccount")}{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              {t("signIn")}
            </Link>
          </span>
        }
      >
        <SignupForm />
      </AuthCard>
    </RedirectIfAuthed>
  );
}
