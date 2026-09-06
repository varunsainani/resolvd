"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button, Field, FormError, Input, PasswordInput } from "@/components/ui";
import { errorMessage } from "@/lib/errors";
import { useAuth } from "./auth-provider";

export function SignupForm() {
  const { signup } = useAuth();
  const router = useRouter();
  const t = useTranslations("auth");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signup(name, email, password);
      router.replace("/dashboard");
    } catch (err) {
      setError(errorMessage(err, t("genericError")));
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <FormError message={error} />
      <Field label={t("name")} htmlFor="name">
        <Input
          id="name"
          autoComplete="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t("namePlaceholder")}
        />
      </Field>
      <Field label={t("email")} htmlFor="email">
        <Input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("emailPlaceholder")}
        />
      </Field>
      <Field label={t("password")} htmlFor="password">
        <PasswordInput
          id="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t("passwordPlaceholder")}
        />
      </Field>
      <Button type="submit" className="w-full" loading={loading}>
        {loading ? t("creatingAccount") : t("signUpCta")}
      </Button>
    </form>
  );
}
