"use client";

import { useEffect, useState } from "react";

import { SearchInput } from "@/components/ui/search-input";
import { useDebounce } from "@/hooks";

// Controlled, debounced search box shared by the list pages. Holds local input
// state and only pushes the settled value up so each keystroke doesn't refetch.
export function SearchBar({
  value,
  onChange,
  placeholder,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
}) {
  const [text, setText] = useState(value);
  const debounced = useDebounce(text, 300);

  useEffect(() => {
    if (debounced !== value) onChange(debounced);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  useEffect(() => {
    setText(value);
  }, [value]);

  return (
    <SearchInput
      value={text}
      onChange={(e) => setText(e.target.value)}
      placeholder={placeholder}
      aria-label={placeholder}
      className={className}
    />
  );
}
