import type { KbArticle } from "@prisma/client";
import { z } from "zod";

import { getProvider } from "../llm";
import { clamp, normalizeWhitespace } from "../lib/text";
import { parseJsonObject } from "./json";

export interface SuggestMessage {
  authorType: "CUSTOMER" | "AGENT" | "SYSTEM";
  body: string;
}

export interface SuggestInput {
  subject: string;
  customerName?: string;
  agentName?: string;
  messages: SuggestMessage[];
  articles: KbArticle[];
  locale?: string;
}

export interface SuggestResult {
  reply: string;
  usedArticles: { id: string; title: string }[];
  source: "ai" | "fallback";
}

const suggestSchema = z.object({ reply: z.string() });

const LANG_NAME: Record<string, string> = { en: "English", es: "Spanish", pt: "Portuguese" };

function buildSystem(locale: string): string {
  const lang = LANG_NAME[locale] || "English";
  return [
    "You are an experienced, friendly customer support agent drafting a reply for a human agent to review.",
    `Write the reply in ${lang}.`,
    "Ground your answer in the provided knowledge base excerpts when they are relevant.",
    "If the excerpts do not cover the question, be helpful and honest and never invent product specifics, prices, or policies.",
    "Be warm, concise, and professional. Address the customer by name when known, and close politely.",
    'Respond with a single JSON object of the form {"reply":"<the reply text>"}.',
    "Do not include any text outside the JSON object.",
  ].join(" ");
}

function buildUser(input: SuggestInput): string {
  const parts: string[] = [];
  if (input.customerName) parts.push(`Customer name: ${input.customerName}`);
  if (input.agentName) parts.push(`Your name (the agent): ${input.agentName}`);
  parts.push(`Ticket subject: ${input.subject || "(no subject)"}`);

  if (input.articles.length) {
    parts.push("", "Knowledge base excerpts you may draw on:");
    input.articles.forEach((a, i) => {
      parts.push(`[${i + 1}] ${a.title}\n${clamp(a.body, 600)}`);
    });
  } else {
    parts.push("", "No knowledge base articles matched this ticket.");
  }

  parts.push("", "Conversation so far (most recent last):");
  for (const m of input.messages) {
    const who = m.authorType === "CUSTOMER" ? "Customer" : m.authorType === "AGENT" ? "Agent" : "System";
    parts.push(`${who}: ${m.body}`);
  }
  parts.push("", "Draft the next reply from the agent to the customer.");
  return parts.join("\n");
}

// Localized, deterministic reply used when the model is unavailable. It never
// invents specifics: it acknowledges the issue and, if an article matched,
// nudges the agent toward it.
function fallbackReply(input: SuggestInput): string {
  const locale = input.locale || "en";
  const name = input.customerName?.split(" ")[0];
  const article = input.articles[0];
  if (locale === "es") {
    return [
      `Hola${name ? ` ${name}` : ""},`,
      "",
      "Gracias por escribirnos. Lamento el inconveniente y con gusto te ayudo con esto.",
      article ? `Es posible que este artículo te sea útil: "${article.title}".` : "",
      "Estoy revisando los detalles y te comparto una solución en breve.",
      "",
      `Saludos,${input.agentName ? `\n${input.agentName}` : ""}`,
    ].filter(Boolean).join("\n");
  }
  if (locale === "pt") {
    return [
      `Olá${name ? ` ${name}` : ""},`,
      "",
      "Obrigado por entrar em contato. Sinto pelo transtorno e ficarei feliz em ajudar com isto.",
      article ? `Este artigo pode ajudar: "${article.title}".` : "",
      "Estou verificando os detalhes e retorno com uma solução em breve.",
      "",
      `Atenciosamente,${input.agentName ? `\n${input.agentName}` : ""}`,
    ].filter(Boolean).join("\n");
  }
  return [
    `Hi${name ? ` ${name}` : ""},`,
    "",
    "Thanks for reaching out, and sorry for the trouble. I'd be glad to help with this.",
    article ? `You may find this article helpful: "${article.title}".` : "",
    "I'm looking into the details now and will follow up shortly with a resolution.",
    "",
    `Best regards,${input.agentName ? `\n${input.agentName}` : ""}`,
  ].filter(Boolean).join("\n");
}

// Draft a suggested agent reply. Always resolves; falls back to a localized
// template so the "suggest reply" button never dead-ends.
export async function suggestReply(input: SuggestInput): Promise<SuggestResult> {
  const locale = input.locale || "en";
  const usedArticles = input.articles.map((a) => ({ id: a.id, title: a.title }));
  let reply: string | null = null;
  try {
    const raw = await getProvider().complete(buildSystem(locale), buildUser(input));
    const val = suggestSchema.safeParse(parseJsonObject(raw));
    if (val.success && val.data.reply.trim()) {
      reply = normalizeWhitespace(val.data.reply);
    }
  } catch {
    reply = null;
  }
  return {
    reply: reply || fallbackReply(input),
    usedArticles,
    source: reply ? "ai" : "fallback",
  };
}
