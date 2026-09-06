import { ApiError } from "@/lib/api";

// Pick a user-facing message from a caught error. ApiError already carries the
// backend's localized `detail`; anything else (network failure, etc.) falls back
// to a generic localized message.
export function errorMessage(err: unknown, fallback: string): string {
  if (err instanceof ApiError) return err.message;
  return fallback;
}
