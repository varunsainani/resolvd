import { AlertCircle } from "lucide-react";

// Inline error banner for form submissions.
export function FormError({ message }: { message?: string | null }) {
  if (!message) return null;
  return (
    <div
      role="alert"
      className="flex items-start gap-2 rounded-md bg-danger-soft px-3 py-2 text-sm text-danger"
    >
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
}
