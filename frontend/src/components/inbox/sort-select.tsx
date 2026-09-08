"use client";

import { useTranslations } from "next-intl";

import { INBOX_SORTS, type InboxSort } from "@/lib/inbox-params";
import { FilterSelect } from "./filter-select";

// Sort order picker. Always carries a value (defaults to "newest"), so it has no
// empty "all" option.
export function SortSelect({
  value,
  onChange,
}: {
  value: InboxSort;
  onChange: (value: InboxSort) => void;
}) {
  const t = useTranslations("inbox");
  const options = INBOX_SORTS.map((sort) => ({ value: sort, label: t(`sortOptions.${sort}`) }));

  return (
    <FilterSelect
      label={t("filters.sort")}
      value={value}
      options={options}
      onChange={(v) => onChange(v as InboxSort)}
    />
  );
}
