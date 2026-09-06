"use client";

import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";

import { ApiError } from "@/lib/api";

export interface MutationState<Args extends unknown[], T> {
  mutate: (...args: Args) => Promise<T | null>;
  loading: boolean;
  error: string | null;
  reset: () => void;
}

// Run a one-off API call (create/update/delete) with loading + error state. On
// failure it returns null (and stores the localized error) rather than throwing,
// so forms can branch on the result.
export function useMutation<Args extends unknown[], T>(
  fn: (...args: Args) => Promise<T>,
): MutationState<Args, T> {
  const t = useTranslations("common");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(
    async (...args: Args): Promise<T | null> => {
      setLoading(true);
      setError(null);
      try {
        const result = await fn(...args);
        setLoading(false);
        return result;
      } catch (err) {
        setError(err instanceof ApiError ? err.message : t("error"));
        setLoading(false);
        return null;
      }
    },
    [fn, t],
  );

  const reset = useCallback(() => setError(null), []);
  return { mutate, loading, error, reset };
}
