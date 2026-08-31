import { z } from "zod";

import { getProvider, LLMProvider } from "../llm";
import {
  CATEGORIES,
  CategoryValue,
  SENTIMENTS,
  SentimentValue,
  TICKET_PRIORITIES,
  TicketPriorityValue,
  normalizeCategory,
} from "../lib/constants";
import { clamp, normalizeWhitespace } from "../lib/text";
import { parseJsonObject } from "./json";
import {
  fallbackCategory,
  fallbackPriority,
  fallbackSentiment,
  fallbackSummary,
  fallbackTags,
} from "./triage-fallback";

export interface TriageInput {
  subject: string;
  message: string;
  customerName?: string;
}

export interface TriageResult {
  priority: TicketPriorityValue;
  category: CategoryValue;
  tags: string[];
  sentiment: SentimentValue;
  summary: string;
  source: "ai" | "fallback";
}

const triageSchema = z.object({
  priority: z.string(),
  category: z.string(),
  tags: z.array(z.string()).optional().default([]),
  sentiment: z.string(),
  summary: z.string().optional().default(""),
});

function buildSystem(): string {
  return [
    "You are a senior customer support triage assistant.",
    "Read the incoming ticket and classify it precisely and calmly.",
    'Respond with a single JSON object of the form {"priority":"...","category":"...","tags":["..."],"sentiment":"...","summary":"..."}.',
    `priority must be one of: ${TICKET_PRIORITIES.join(", ")}.`,
    `category must be one of: ${CATEGORIES.join(", ")}.`,
    `sentiment must be one of: ${SENTIMENTS.join(", ")}.`,
    "tags: one to three short lowercase kebab-case labels (e.g. login, refund, api).",
    "summary: one neutral sentence, at most 20 words, describing the customer's core issue.",
    "Do not include any text outside the JSON object.",
  ].join(" ");
}

function buildUser(input: TriageInput): string {
  const lines = [
    input.customerName ? `Customer: ${input.customerName}` : null,
    `Subject: ${input.subject || "(no subject)"}`,
    "Message:",
    input.message || "(no message body)",
  ].filter(Boolean);
  return lines.join("\n");
}

function normalizePriority(value: unknown): TicketPriorityValue | null {
  if (typeof value !== "string") return null;
  const up = value.toUpperCase().trim();
  return (TICKET_PRIORITIES as readonly string[]).includes(up)
    ? (up as TicketPriorityValue)
    : null;
}

function normalizeSentiment(value: unknown): SentimentValue | null {
  if (typeof value !== "string") return null;
  const up = value.toUpperCase().trim();
  return (SENTIMENTS as readonly string[]).includes(up) ? (up as SentimentValue) : null;
}

// Clean model tags into at most three lowercase kebab-case labels.
function normalizeTags(tags: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of tags) {
    const slug = String(raw)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    if (slug.length >= 2 && slug.length <= 24 && !seen.has(slug)) {
      seen.add(slug);
      out.push(slug);
    }
    if (out.length >= 3) break;
  }
  return out;
}

// Classify a ticket. Always resolves; on any model failure or gap it fills the
// field from the deterministic heuristics so every ticket gets full triage.
export async function triageTicket(
  input: TriageInput,
  provider: LLMProvider = getProvider(),
): Promise<TriageResult> {
  const combined = `${input.subject}\n${input.message}`;
  let parsed: z.infer<typeof triageSchema> | null = null;
  try {
    const raw = await provider.complete(buildSystem(), buildUser(input));
    const obj = parseJsonObject(raw);
    const val = triageSchema.safeParse(obj);
    if (val.success) parsed = val.data;
  } catch {
    parsed = null;
  }

  const priority = (parsed && normalizePriority(parsed.priority)) || fallbackPriority(combined);
  const sentiment = (parsed && normalizeSentiment(parsed.sentiment)) || fallbackSentiment(combined);
  const category = parsed?.category
    ? normalizeCategory(parsed.category)
    : fallbackCategory(combined);
  const modelTags = parsed ? normalizeTags(parsed.tags) : [];
  const tags = modelTags.length ? modelTags : fallbackTags(combined);
  const summary = parsed?.summary?.trim()
    ? clamp(normalizeWhitespace(parsed.summary), 160)
    : fallbackSummary(input.subject, input.message);

  return {
    priority,
    category,
    tags,
    sentiment,
    summary,
    source: parsed ? "ai" : "fallback",
  };
}
