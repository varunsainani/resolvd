"use client";

import { createContext, useContext } from "react";

import type { ReplyBody, TicketPatchBody } from "@/lib/api";
import type { SuggestResult, TicketDetail } from "@/types";

// Actions shared by every ticket-detail panel. Provided once by the detail view
// so the properties, assignee, tag, and composer panels don't prop-drill the
// ticket id and mutation plumbing.
export interface TicketActions {
  ticket: TicketDetail;
  patch: (body: TicketPatchBody) => Promise<void>;
  assign: (assigneeId: string | null) => Promise<void>;
  reply: (body: ReplyBody) => Promise<boolean>;
  addTag: (name: string) => Promise<void>;
  removeTag: (name: string) => Promise<void>;
  suggest: () => Promise<SuggestResult | null>;
  // True while any property/assignee mutation is in flight (dims the controls).
  patching: boolean;
}

const TicketActionsContext = createContext<TicketActions | null>(null);

export const TicketActionsProvider = TicketActionsContext.Provider;

export function useTicketActions(): TicketActions {
  const value = useContext(TicketActionsContext);
  if (!value) throw new Error("useTicketActions must be used within a ticket detail view");
  return value;
}
