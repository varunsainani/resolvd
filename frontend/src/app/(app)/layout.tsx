import { AppShell } from "@/components/shell/app-shell";

// Layout for every authenticated page. Wraps children in the app shell (sidebar
// + top bar) and the client-side auth gate.
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
