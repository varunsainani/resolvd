"use client";

import { Select } from "@/components/ui/select";
import { cn } from "@/lib/cn";

export interface FilterOption {
  value: string;
  label: string;
}

// A compact inbox filter select. When `allLabel` is given, an empty-value option
// heads the list and doubles as the placeholder ("all"); omit it for selects
// that always carry a value (like sort).
export function FilterSelect({
  label,
  value,
  allLabel,
  options,
  onChange,
  className,
}: {
  label: string;
  value: string;
  allLabel?: string;
  options: FilterOption[];
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <Select
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn("sm:w-auto", className)}
    >
      {allLabel !== undefined && <option value="">{allLabel}</option>}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </Select>
  );
}
