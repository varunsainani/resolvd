"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { SearchInput } from "@/components/ui/search-input";
import { useDebounce } from "@/hooks";

// Search box with local input state and a debounced push up to the filters, so
// typing doesn't fire a request (or a new history entry) on every keystroke.
export function InboxSearch({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const t = useTranslations("inbox");
  const [text, setText] = useState(value);
  const debounced = useDebounce(text, 350);

  // Push the settled value up, guarding against echoing the same value back.
  useEffect(() => {
    if (debounced !== value) onChange(debounced);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  // Re-sync when the filter is cleared or changed elsewhere (e.g. Clear button).
  useEffect(() => {
    setText(value);
  }, [value]);

  return (
    <SearchInput
      value={text}
      onChange={(e) => setText(e.target.value)}
      placeholder={t("searchPlaceholder")}
      aria-label={t("searchPlaceholder")}
      className="w-full"
    />
  );
}
