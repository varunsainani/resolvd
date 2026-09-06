"use client";

import { PlayCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button, FormError } from "@/components/ui";
import { errorMessage } from "@/lib/errors";
import { useAuth } from "./auth-provider";

// One-click entry into the seeded demo account.
export function DemoButton() {
  const { demo } = useAuth();
  const router = useRouter();
  const t = useTranslations("auth");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function enter() {
    setLoading(true);
    setError(null);
    try {
      await demo();
      router.replace("/dashboard");
    } catch (err) {
      setError(errorMessage(err, t("genericError")));
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <FormError message={error} />
      <Button variant="outline" className="w-full" onClick={enter} loading={loading}>
        {!loading && <PlayCircle className="h-4 w-4" />}
        {loading ? t("enteringDemo") : t("demoCta")}
      </Button>
      <p className="text-center text-xs text-muted-foreground">{t("demoHint")}</p>
    </div>
  );
}
