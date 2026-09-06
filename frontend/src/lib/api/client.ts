import { LOCALE_COOKIE, defaultLocale } from "@/i18n/config";
import { getToken } from "./token";

// Error carrying the HTTP status and the backend's localized `detail` message,
// so callers can branch on status and surface the message directly.
export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

// Read the active locale from the cookie so requests carry the same x-locale the
// backend uses to localize responses.
function currentLocale(): string {
  if (typeof document === "undefined") return defaultLocale;
  const match = document.cookie.match(new RegExp(`(?:^|; )${LOCALE_COOKIE}=([^;]+)`));
  return match ? decodeURIComponent(match[1]) : defaultLocale;
}

// Serialize a params object into a query string, skipping empty values.
export function toQuery(params?: Record<string, string | number | undefined | null>): string {
  if (!params) return "";
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") qs.set(key, String(value));
  }
  const str = qs.toString();
  return str ? `?${str}` : "";
}

export interface RequestOptions {
  body?: unknown;
  // Override the token (e.g. right after login); pass null to force no auth.
  token?: string | null;
  // Set false for public endpoints that must not send a stale token.
  auth?: boolean;
}

export async function request<T>(
  method: string,
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { body, auth = true } = options;
  const token = options.token !== undefined ? options.token : auth ? getToken() : null;

  const headers: Record<string, string> = { "x-locale": currentLocale() };
  if (body !== undefined) headers["content-type"] = "application/json";
  if (token) headers["authorization"] = `Bearer ${token}`;

  const res = await fetch(`/api${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const json = await res.json().catch(() => null);
  if (!res.ok) {
    const detail =
      json && typeof json.detail === "string" ? json.detail : `Request failed (${res.status})`;
    throw new ApiError(res.status, detail);
  }
  return json as T;
}

// Thin verb helpers over request().
export const api = {
  get: <T>(path: string, opts?: RequestOptions) => request<T>("GET", path, opts),
  post: <T>(path: string, body?: unknown, opts?: RequestOptions) =>
    request<T>("POST", path, { ...opts, body }),
  patch: <T>(path: string, body?: unknown, opts?: RequestOptions) =>
    request<T>("PATCH", path, { ...opts, body }),
  del: <T>(path: string, opts?: RequestOptions) => request<T>("DELETE", path, opts),
};
