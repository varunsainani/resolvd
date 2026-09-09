"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import { useAuth } from "@/components/auth/auth-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { FormError } from "@/components/ui/form-error";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { useMutation } from "@/hooks";

// Display-name editor. Email and role are read-only (email is the identity; role
// is managed by admins on the team page).
export function ProfileForm() {
  const t = useTranslations("settings");
  const tRoles = useTranslations("roles");
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState(user?.name ?? "");
  const save = useMutation(async (nextName: string) => {
    await updateProfile({ name: nextName });
    return true;
  });

  if (!user) return null;
  const trimmed = name.trim();
  const dirty = trimmed !== "" && trimmed !== user.name;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!dirty) return;
    const ok = await save.mutate(trimmed);
    if (ok) toast(t("saved"));
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{t("profile")}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <FormError message={save.error} />
          <Field label={t("name")} htmlFor="pf-name">
            <Input id="pf-name" value={name} onChange={(e) => setName(e.target.value)} required />
          </Field>
          <Field label={t("email")} htmlFor="pf-email" hint={t("emailHint")}>
            <Input id="pf-email" value={user.email} disabled readOnly />
          </Field>
          <div>
            <p className="mb-1.5 text-sm font-medium text-foreground">{t("role")}</p>
            <Badge tone={user.role === "admin" ? "primary" : "neutral"}>{tRoles(user.role)}</Badge>
          </div>
          <div className="flex justify-end">
            <Button type="submit" loading={save.loading} disabled={!dirty}>
              {save.loading ? t("saving") : t("save")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
