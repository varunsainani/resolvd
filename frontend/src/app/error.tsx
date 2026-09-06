"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

// Root error boundary. Keeps copy generic; specific API errors surface inline on
// their pages.
export default function Error({ reset }: { error: Error; reset: () => void }) {
  const t = useTranslations("common");
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 p-8 text-center">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Something went wrong</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          An unexpected error occurred. Please try again.
        </p>
      </div>
      <Button onClick={reset}>{t("retry")}</Button>
    </div>
  );
}
