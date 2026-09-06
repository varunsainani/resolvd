import { Spinner } from "@/components/ui/spinner";

// Route-level fallback while a segment loads.
export default function Loading() {
  return (
    <div className="flex min-h-dvh items-center justify-center">
      <Spinner className="h-6 w-6 text-muted-foreground" />
    </div>
  );
}
