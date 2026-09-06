import type { PublicTicket } from "@/types";
import { api, toQuery } from "./client";

export interface PublicSubmitBody {
  name: string;
  email: string;
  subject: string;
  message: string;
  company?: string;
}

// Unauthenticated customer-facing endpoints.
export const publicApi = {
  submit: (body: PublicSubmitBody) =>
    api.post<{ ticket: PublicTicket }>("/public/tickets", body, { auth: false }),
  status: (reference: number | string, email: string) =>
    api.get<{ ticket: PublicTicket }>(
      `/public/tickets/${reference}${toQuery({ email })}`,
      { auth: false },
    ),
};
