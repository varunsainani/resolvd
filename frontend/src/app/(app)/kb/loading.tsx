import { Skeleton } from "@/components/ui/skeleton";

export default function KbLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-9 w-full" />
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    </div>
  );
}
