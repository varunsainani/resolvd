// Bearer token persistence. The JWT lives in localStorage so the browser-side
// API client can attach it; SSR-safe guards keep it from touching window on the
// server.
const TOKEN_KEY = "resolvd-token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  if (typeof window !== "undefined") window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  if (typeof window !== "undefined") window.localStorage.removeItem(TOKEN_KEY);
}
