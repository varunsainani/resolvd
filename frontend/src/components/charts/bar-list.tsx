import { maxCount } from "@/lib/chart";
import { BarListRow } from "./bar-list-row";

export interface BarItem {
  key: string;
  label: string;
  value: number;
  // Tailwind bg-* class for the fill; falls back to the brand color.
  colorClass?: string;
}

// A horizontal bar list for a categorical breakdown. All bars scale against the
// largest value so the leading category fills its track.
export function BarList({ items }: { items: BarItem[] }) {
  const max = maxCount(items.map((item) => ({ count: item.value })));
  return (
    <div className="space-y-2.5">
      {items.map((item) => (
        <BarListRow
          key={item.key}
          label={item.label}
          value={item.value}
          max={max}
          colorClass={item.colorClass}
        />
      ))}
    </div>
  );
}
