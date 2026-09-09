import type { Metadata } from "next";

import { PublicSubmit } from "@/components/public";

export const metadata: Metadata = {
  title: "Submit a ticket",
  description: "Open a support ticket and get an instant, AI-triaged confirmation.",
};

// Public help page (no auth). Customers submit and track tickets here.
export default function SubmitPage() {
  return <PublicSubmit />;
}
