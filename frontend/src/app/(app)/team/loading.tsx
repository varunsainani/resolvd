import { ListSkeleton } from "@/components/ui/list-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function TeamLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-32" />
      <ListSkeleton rows={4} />
    </div>
  );
}
