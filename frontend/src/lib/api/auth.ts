import type { User } from "@/types";
import { api } from "./client";

export interface AuthResult {
  token: string;
  user: User;
}

export type ProfileUpdate = Partial<Pick<User, "name" | "locale" | "theme">>;

// Auth endpoints. Login/signup/demo run without a token (auth: false).
export const authApi = {
  login: (email: string, password: string) =>
    api.post<AuthResult>("/auth/login", { email, password }, { auth: false }),
  signup: (name: string, email: string, password: string) =>
    api.post<AuthResult>("/auth/signup", { name, email, password }, { auth: false }),
  demo: () => api.post<AuthResult>("/auth/demo", undefined, { auth: false }),
  me: () => api.get<{ user: User }>("/auth/me"),
  updateProfile: (data: ProfileUpdate) => api.patch<{ user: User }>("/auth/me", data),
};
