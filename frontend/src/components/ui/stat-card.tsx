import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/cn";

// KPI tile for the dashboard and analytics: label, big value, optional icon and
// hint line.
export function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  iconClassName,
}: {
  label: string;
  value: React.ReactNode;
  icon?: LucideIcon;
  hint?: string;
  iconClassName?: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        {Icon && <Icon className={cn("h-4 w-4 text-muted-foreground", iconClassName)} />}
      </div>
      <p className="mt-2 font-display text-2xl font-bold text-foreground">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
