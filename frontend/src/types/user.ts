import type { Role } from "./enums";

// Public user profile (serializeUser) — never includes the password hash.
export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  locale: string;
  theme: string;
  avatarColor: string;
}

// Compact agent reference used for assignee and message author display.
export interface AgentRef {
  id: string;
  name: string;
  avatarColor: string;
}

// Team member with workload counts (serializeAgentSummary), for the admin roster.
export interface AgentSummary extends User {
  createdAt: string;
  openAssigned: number;
  totalAssigned: number;
}
