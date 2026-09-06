import type { Listed, User } from "@/types";
import { api } from "./client";

// Team roster for the assignee picker (any authenticated agent).
export const agentsApi = {
  list: () => api.get<Listed<User>>("/agents"),
};
