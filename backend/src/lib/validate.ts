import { badRequest } from "./http";

// Small, dependency-light request validators. Each throws an ApiError with a
// specific i18n key on failure so the central handler can localize the message.

// Require a non-empty string, returning it trimmed.
export function requireString(value: unknown, key = "invalid_input"): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw badRequest(key);
  }
  return value.trim();
}

// Coerce an optional field to a trimmed string, or undefined when absent/blank.
export function optionalString(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
}

// Lenient email check: one @, non-empty local and domain parts, a dot in the
// domain. Deliberately permissive so we accept real addresses without a heavy
// regex, then normalize to lowercase.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function requireEmail(value: unknown, key = "email_required"): string {
  const raw = typeof value === "string" ? value.trim().toLowerCase() : "";
  if (!EMAIL_RE.test(raw)) {
    throw badRequest(key);
  }
  return raw;
}
