"use client";

import { useTranslations } from "next-intl";

import { useApi } from "@/hooks";
import { agentsApi } from "@/lib/api";
import { FilterSelect, type FilterOption } from "./filter-select";

// Assignee filter: the two sentinels the backend understands ("me",
// "unassigned") followed by the live team roster.
export function AssigneeFilter({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const t = useTranslations("inbox");
  const { data } = useApi(() => agentsApi.list(), []);

  const options: FilterOption[] = [
    { value: "me", label: t("assignedToMe") },
    { value: "unassigned", label: t("unassigned") },
    ...(data?.data ?? []).map((agent) => ({ value: agent.id, label: agent.name })),
  ];

  return (
    <FilterSelect
      label={t("filters.assignee")}
      allLabel={t("filters.assignee")}
      value={value}
      options={options}
      onChange={onChange}
    />
  );
}
