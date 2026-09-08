import { ListSkeleton } from "@/components/ui/list-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

// Route-level fallback shown while the inbox segment loads.
export default function InboxLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-40" />
      <Skeleton className="h-9 w-full" />
      <ListSkeleton rows={6} />
    </div>
  );
}
