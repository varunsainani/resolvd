import type { Request } from "express";

const SUPPORTED = ["en", "es", "pt"];
const DEFAULT = "en";

const MESSAGES: Record<string, Record<string, string>> = {
  not_authenticated: {
    en: "Please sign in to continue.",
    es: "Inicia sesión para continuar.",
    pt: "Faça login para continuar.",
  },
  forbidden: {
    en: "You do not have access to this.",
    es: "No tienes acceso a esto.",
    pt: "Você não tem acesso a isto.",
  },
  email_taken: {
    en: "That email is already registered.",
    es: "Ese correo ya está registrado.",
    pt: "Esse e-mail já está cadastrado.",
  },
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
