"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { FormError } from "@/components/ui/form-error";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { PasswordInput } from "@/components/ui/password-input";
import { Select } from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";
import { useMutation } from "@/hooks";
import { adminApi, type InviteBody } from "@/lib/api";
import type { AgentSummary, Role } from "@/types";

const ROLES: Role[] = ["agent", "admin"];

// Add a team member. Creates the account with a temporary password the agent can
// change later in settings.
export function AddAgentModal({
  open,
  onClose,
  onAdded,
}: {
  open: boolean;
  onClose: () => void;
  onAdded: (agent: AgentSummary) => void;
}) {
  const t = useTranslations("team.addModal");
  const tRoles = useTranslations("roles");
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("agent");
  const add = useMutation((body: InviteBody) => adminApi.invite(body));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await add.mutate({ name: name.trim(), email: email.trim(), password, role });
    if (res) {
      onAdded(res.agent);
      toast(t("created"));
      onClose();
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={t("title")}>
      <form onSubmit={onSubmit} className="space-y-4">
        <FormError message={add.error} />
        <Field label={t("name")} htmlFor="aa-name">
          <Input
            id="aa-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder={t("namePlaceholder")}
          />
        </Field>
        <Field label={t("email")} htmlFor="aa-email">
          <Input
            id="aa-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder={t("emailPlaceholder")}
          />
        </Field>
        <Field label={t("password")} htmlFor="aa-pass">
          <PasswordInput
            id="aa-pass"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            placeholder={t("passwordPlaceholder")}
          />
        </Field>
        <Field label={t("role")} htmlFor="aa-role">
          <Select id="aa-role" value={role} onChange={(e) => setRole(e.target.value as Role)}>
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {tRoles(r)}
              </option>
            ))}
          </Select>
        </Field>
        <div className="flex justify-end">
          <Button type="submit" loading={add.loading}>
            {add.loading ? t("submitting") : t("submit")}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
