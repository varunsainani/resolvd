import type { Request } from "express";

const SUPPORTED = ["en", "es", "pt"];
const DEFAULT = "en";

const MESSAGES: Record<string, Record<string, string>> = {
  invalid_credentials: {
    en: "Invalid email or password.",
    es: "Correo o contraseña no válidos.",
    pt: "E-mail ou senha inválidos.",
  },
};

export function resolveLocale(req: Request): string {
  const header = String(req.headers["x-locale"] || "").toLowerCase().trim();
  if (SUPPORTED.includes(header)) return header;
  const accept = String(req.headers["accept-language"] || "").toLowerCase();
  for (const part of accept.split(",")) {
    const code = part.split(";")[0].trim().slice(0, 2);
    if (SUPPORTED.includes(code)) return code;
  }
  return DEFAULT;
}

export function t(key: string, locale = DEFAULT): string {
  const entry = MESSAGES[key];
  if (!entry) return key;
  return entry[locale] || entry[DEFAULT] || key;
}
