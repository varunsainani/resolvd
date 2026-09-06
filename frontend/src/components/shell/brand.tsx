import { Headset } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/cn";

// Resolvd wordmark + mark, linking home. Used in the sidebar and mobile header.
export function Brand({ className }: { className?: string }) {
  return (
    <Link href="/dashboard" className={cn("flex items-center gap-2.5", className)}>
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Headset className="h-4 w-4" />
      </span>
      <span className="font-display text-lg font-extrabold tracking-tight text-foreground">
        Resolvd
      </span>
    </Link>
  );
}
