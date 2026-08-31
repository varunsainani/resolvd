// Small text helpers shared by the AI layer. Kept dependency-free and
// deterministic so they can back both the LLM prompts and the offline
// fallbacks without any surprises.

// Very small English stopword set. Enough to keep keyword overlap scoring
// focused on meaningful terms without pulling in an NLP dependency.
const STOPWORDS = new Set([
  "the", "a", "an", "and", "or", "but", "if", "then", "so", "to", "of", "in",
  "on", "for", "with", "at", "by", "from", "up", "about", "into", "over",
  "after", "is", "are", "was", "were", "be", "been", "being", "am", "do",
  "does", "did", "have", "has", "had", "i", "you", "he", "she", "it", "we",
  "they", "my", "your", "our", "their", "this", "that", "these", "those",
  "me", "us", "them", "as", "not", "no", "can", "cannot", "cant", "will",
  "would", "should", "could", "please", "hi", "hello", "hey", "thanks",
  "thank", "there", "here", "when", "what", "how", "why", "who", "which",
]);

// Lowercase, strip punctuation, split into meaningful word tokens.
export function tokenize(text: string): string[] {
  return (text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w));
}

// Unique meaningful tokens, useful for keyword overlap and tag heuristics.
export function keywordSet(text: string): Set<string> {
  return new Set(tokenize(text));
}

// Collapse whitespace and trim, used to clean model output before storing.
export function normalizeWhitespace(text: string): string {
  return (text || "")
    .replace(/[^\S\n]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

// Hard cap a string at a sentence-ish boundary, appending an ellipsis.
export function clamp(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd() + "…";
}
