import { barPercent } from "@/lib/chart";
import { cn } from "@/lib/cn";

// One row of a horizontal bar list: a fixed-width label, a proportional bar, and
// the raw count.
export function BarListRow({
  label,
  value,
  max,
  colorClass,
  share,
}: {
  label: string;
  value: number;
  max: number;
  colorClass?: string;
  // Optional share of the total, shown as a dim percentage after the count.
  share?: number;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-24 shrink-0 truncate text-sm text-muted-foreground" title={label}>
        {label}
      </span>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full bg-primary", colorClass)}
          style={{ width: `${barPercent(value, max)}%` }}
        />
      </div>
      <span className="w-8 shrink-0 text-right text-sm font-medium tabular-nums text-foreground">
        {value}
      </span>
      {share !== undefined && (
        <span className="w-10 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
          {share}%
        </span>
      )}
    </div>
  );
}
