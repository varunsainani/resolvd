// Supported locales for the app. i18n is cookie-driven (no URL prefix): the
// dashboard lives behind auth and each user has a saved locale, mirroring the
// backend which resolves locale from the `x-locale` header / user setting.
export const locales = ["en", "es", "pt"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

// Cookie next-intl reads on the server to pick the active locale.
export const LOCALE_COOKIE = "NEXT_LOCALE";

// Human labels for the language switcher.
export const localeLabels: Record<Locale, string> = {
  en: "English",
  es: "Español",
  pt: "Português",
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (locales as readonly string[]).includes(value);
}
