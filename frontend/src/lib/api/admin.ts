import type { AgentSummary, Listed, Role } from "@/types";
import { api } from "./client";

export interface InviteBody {
  name: string;
  email: string;
  password: string;
  role?: Role;
}

// Admin-only team management.
export const adminApi = {
  agents: () => api.get<Listed<AgentSummary>>("/admin/agents"),
  invite: (body: InviteBody) => api.post<{ agent: AgentSummary }>("/admin/agents", body),
  update: (id: string, body: { name?: string; role?: Role }) =>
    api.patch<{ agent: AgentSummary }>(`/admin/agents/${id}`, body),
  remove: (id: string) => api.del<{ ok: boolean }>(`/admin/agents/${id}`),
};
