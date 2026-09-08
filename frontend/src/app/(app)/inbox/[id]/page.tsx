"use client";

import { use } from "react";

import { TicketDetail } from "@/components/ticket";

// Dynamic params are Promises in Next 16; unwrap with `use` in this client page.
export default function TicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <TicketDetail id={id} />;
}
