"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { ApiError, authApi, clearToken, getToken, setToken, type ProfileUpdate } from "@/lib/api";
import type { User } from "@/types";

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface AuthContextValue {
  status: AuthStatus;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  demo: () => Promise<void>;
  logout: () => void;
  updateProfile: (data: ProfileUpdate) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [user, setUser] = useState<User | null>(null);

  // Hydrate from a stored token on mount: verify it with /auth/me, or drop it.
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setStatus("unauthenticated");
      return;
    }
    authApi
      .me()
      .then(({ user }) => {
        setUser(user);
        setStatus("authenticated");
      })
      .catch(() => {
        clearToken();
        setUser(null);
        setStatus("unauthenticated");
      });
  }, []);

  // Persist the token and user from any successful auth response.
  const applyAuth = useCallback((result: { token: string; user: User }) => {
    setToken(result.token);
    setUser(result.user);
    setStatus("authenticated");
  }, []);

  const login = useCallback(
    async (email: string, password: string) => applyAuth(await authApi.login(email, password)),
    [applyAuth],
  );

  const signup = useCallback(
    async (name: string, email: string, password: string) =>
      applyAuth(await authApi.signup(name, email, password)),
    [applyAuth],
  );

  const demo = useCallback(async () => applyAuth(await authApi.demo()), [applyAuth]);

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
    setStatus("unauthenticated");
  }, []);

  const updateProfile = useCallback(async (data: ProfileUpdate) => {
    const { user } = await authApi.updateProfile(data);
    setUser(user);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ status, user, login, signup, demo, logout, updateProfile }),
    [status, user, login, signup, demo, logout, updateProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

// Re-export so pages can branch on error status (e.g. 401 vs 409) without a
// separate import.
export { ApiError };
