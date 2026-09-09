"use client";

import { useTranslations } from "next-intl";

import { Select } from "@/components/ui/select";
import type { Role } from "@/types";

const ROLES: Role[] = ["agent", "admin"];

// Inline role picker for a team member. The backend enforces the last-admin
// guard, so a failed change is surfaced by the caller as a toast.
export function AgentRoleSelect({
  value,
  onChange,
  disabled,
}: {
  value: Role;
  onChange: (role: Role) => void;
  disabled?: boolean;
}) {
  const t = useTranslations("roles");
  return (
    <Select
      aria-label={t(value)}
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value as Role)}
      className="w-32"
    >
      {ROLES.map((role) => (
        <option key={role} value={role}>
          {t(role)}
        </option>
      ))}
    </Select>
  );
}
