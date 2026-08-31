// Pulls a JSON object out of raw model text. Providers are asked for pure JSON,
// but this defends against the occasional code fence or leading prose so a
// stray wrapper never turns into a failed triage.
export function extractJson(raw: string): string {
  let text = (raw || "").trim();
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fence) text = fence[1].trim();
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start >= 0 && end > start) text = text.slice(start, end + 1);
  return text;
}

// Parse model output into an object, returning null on any malformed response
// so callers can cleanly fall back to their deterministic path.
export function parseJsonObject(raw: string): unknown | null {
  const text = extractJson(raw);
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}
