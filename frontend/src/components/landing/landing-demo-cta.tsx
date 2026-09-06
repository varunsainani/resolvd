"use client";

import { PlayCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useAuth } from "@/components/auth/auth-provider";
import { Button, type ButtonSize, type ButtonVariant } from "@/components/ui";

// Landing CTA that drops the visitor straight into the seeded demo. If the demo
// sign-in fails (e.g. a cold backend), it falls back to the login page where the
// demo button can be retried.
export function LandingDemoCta({
  label,
  size = "md",
  variant = "primary",
  withIcon = true,
}: {
  label: string;
  size?: ButtonSize;
  variant?: ButtonVariant;
  withIcon?: boolean;
}) {
  const { demo } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function enter() {
    setLoading(true);
    try {
      await demo();
      router.push("/dashboard");
    } catch {
      router.push("/login");
    }
  }

  return (
    <Button size={size} variant={variant} loading={loading} onClick={enter}>
      {withIcon && !loading && <PlayCircle className="h-4 w-4" />}
      {label}
    </Button>
  );
}
