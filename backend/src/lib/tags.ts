// Normalize a tag name to the shared, lowercase, hyphenated form ("How To" ->
// "how-to") so manually added tags line up with the AI-suggested vocabulary and
// the composite key never collides on case or spacing. Returns "" for junk.
export function normalizeTagName(raw: unknown): string {
  if (typeof raw !== "string") return "";
  return raw.trim().toLowerCase().replace(/\s+/g, "-");
}
