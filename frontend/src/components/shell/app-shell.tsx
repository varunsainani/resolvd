"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAuth } from "@/components/auth/auth-provider";
import { Spinner } from "@/components/ui/spinner";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

// Authenticated app frame: sidebar + top bar + scrollable main. Unauthenticated
// visitors are bounced to the login page (built in chunk 6); while auth is being
// resolved it shows a centered spinner to avoid a flash of the shell.
export function AppShell({ children }: { children: React.ReactNode }) {
  const { status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login");
  }, [status, router]);

  if (status !== "authenticated") {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <Spinner className="h-6 w-6 text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
