import {
  CategoryValue,
  SentimentValue,
  TicketPriorityValue,
  normalizeCategory,
} from "../lib/constants";
import { clamp, tokenize } from "../lib/text";

// Deterministic, dependency-free triage used whenever the model is unavailable
// or returns something unusable. It is intentionally simple keyword matching:
// good enough to keep the inbox useful offline, never blocking on the LLM.

const URGENT_WORDS = [
  "urgent", "emergency", "asap", "immediately", "critical", "outage", "down",
  "cannot access", "can't access", "locked out", "data loss", "security",
  "breach", "charged twice", "double charged", "fraud",
];
const HIGH_WORDS = [
  "broken", "error", "failing", "failed", "not working", "crash", "bug",
  "blocked", "deadline", "important", "refund", "overcharged", "billing",
];
const LOW_WORDS = ["question", "how do i", "wondering", "curious", "feature", "suggestion"];

// Map keyword groups to a category. First match wins, else General.
const CATEGORY_HINTS: Array<[CategoryValue, string[]]> = [
  ["Billing", ["invoice", "charge", "charged", "refund", "payment", "billing", "subscription", "price", "plan"]],
  ["Bug", ["bug", "error", "crash", "broken", "glitch", "exception", "500"]],
  ["Account", ["login", "password", "locked", "access", "account", "sign", "2fa", "email"]],
  ["Integration", ["api", "webhook", "integration", "zapier", "oauth", "token", "endpoint"]],
  ["Onboarding", ["setup", "getting started", "onboarding", "install", "configure", "first"]],
  ["Feature Request", ["feature", "request", "suggestion", "would be nice", "wish", "roadmap"]],
  ["Technical", ["slow", "performance", "timeout", "loading", "sync", "export", "import"]],
];

const NEGATIVE_WORDS = [
  "angry", "frustrated", "disappointed", "terrible", "awful", "worst", "hate",
  "unacceptable", "ridiculous", "annoyed", "upset", "furious", "broken",
  "refund", "cancel", "useless", "poor", "bad", "never", "still not",
];
const POSITIVE_WORDS = [
  "thanks", "thank you", "great", "awesome", "love", "appreciate", "excellent",
  "wonderful", "amazing", "happy", "perfect", "helpful",
];

function contains(haystack: string, words: string[]): boolean {
  return words.some((w) => haystack.includes(w));
}

export function fallbackPriority(text: string): TicketPriorityValue {
  const t = text.toLowerCase();
  if (contains(t, URGENT_WORDS)) return "URGENT";
  if (contains(t, HIGH_WORDS)) return "HIGH";
  if (contains(t, LOW_WORDS)) return "LOW";
  return "NORMAL";
}

export function fallbackCategory(text: string): CategoryValue {
  const t = text.toLowerCase();
  for (const [category, words] of CATEGORY_HINTS) {
    if (contains(t, words)) return category;
  }
  return normalizeCategory("General");
}

export function fallbackSentiment(text: string): SentimentValue {
  const t = text.toLowerCase();
  const neg = NEGATIVE_WORDS.filter((w) => t.includes(w)).length;
  const pos = POSITIVE_WORDS.filter((w) => t.includes(w)).length;
  if (neg > pos) return "NEGATIVE";
  if (pos > neg) return "POSITIVE";
  return "NEUTRAL";
}

// Derive up to three tags from the known vocabulary by keyword association.
const TAG_HINTS: Array<[string, string[]]> = [
  ["urgent", URGENT_WORDS],
  ["refund", ["refund", "money back", "reimburse"]],
  ["payment", ["payment", "charge", "charged", "invoice", "card"]],
  ["login", ["login", "log in", "sign in", "password", "locked"]],
  ["outage", ["outage", "down", "offline", "unavailable"]],
  ["bug", ["bug", "error", "crash", "broken", "exception"]],
  ["api", ["api", "webhook", "endpoint", "token"]],
  ["how-to", ["how do i", "how to", "how can i", "guide"]],
  ["onboarding", ["setup", "onboarding", "getting started", "install"]],
  ["feature-request", ["feature", "suggestion", "request", "roadmap"]],
  ["mobile", ["mobile", "android", "ios", "app store", "phone"]],
];

export function fallbackTags(text: string): string[] {
  const t = text.toLowerCase();
  const tags: string[] = [];
  for (const [tag, words] of TAG_HINTS) {
    if (contains(t, words)) tags.push(tag);
    if (tags.length >= 3) break;
  }
  return tags;
}

// One-line summary: the first sentence of the customer's message, clamped.
export function fallbackSummary(subject: string, message: string): string {
  const source = (message || subject || "").trim();
  const firstSentence = source.split(/(?<=[.!?])\s/)[0] || source;
  const words = tokenize(firstSentence);
  const base = words.length >= 3 ? firstSentence : subject || firstSentence;
  return clamp(base.replace(/\s+/g, " ").trim(), 140);
}
