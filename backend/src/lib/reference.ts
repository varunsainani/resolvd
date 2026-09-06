// Parse a human ticket reference ("#1042", "1042", 1042) into a positive
// integer, or null when it is not a valid reference. Shared by the public
// status lookup and the inbox search so both accept the same forms.
export function parseReference(raw: unknown): number | null {
  if (typeof raw !== "string" && typeof raw !== "number") return null;
  const n = Number(String(raw).trim().replace(/^#/, "").trim());
  return Number.isInteger(n) && n > 0 ? n : null;
}
