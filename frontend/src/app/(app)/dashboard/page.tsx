import { DashboardView } from "@/components/dashboard";

// Authenticated home. The interactive overview lives in DashboardView (a client
// component) so this route stays a thin server entry.
export default function DashboardPage() {
  return <DashboardView />;
}
