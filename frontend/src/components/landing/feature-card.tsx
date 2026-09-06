import type { LucideIcon } from "lucide-react";

export function FeatureCard({
  icon: Icon,
  title,
  body,
}: {
  icon: LucideIcon;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-6 transition-shadow hover:shadow-md">
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
        <Icon className="h-5 w-5" />
      </span>
      <h3 className="mt-4 font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}
