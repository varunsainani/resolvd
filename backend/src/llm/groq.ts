import { BACKOFFS, LLMProvider, RETRY_STATUSES, fetchWithTimeout, sleep } from "./base";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

// Groq's OpenAI-compatible chat endpoint. We force JSON object output so the
// triage and suggestion parsers get a clean object without prose around it.
export class GroqProvider implements LLMProvider {
  name = "groq";
  constructor(private apiKey: string, private model: string) {}

  async complete(system: string, user: string): Promise<string> {
    const body = {
      model: this.model,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      temperature: 0.4,
      response_format: { type: "json_object" },
    };
    for (let attempt = 0; attempt <= BACKOFFS.length; attempt++) {
      let res: Response;
      try {
        res = await fetchWithTimeout(GROQ_URL, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });
      } catch {
        // Timeout or network error: retry with backoff, then give up (fallback).
        if (attempt < BACKOFFS.length) {
          await sleep(BACKOFFS[attempt]);
          continue;
        }
        throw new Error("groq timeout");
      }
      if (!res.ok) {
        if (RETRY_STATUSES.has(res.status) && attempt < BACKOFFS.length) {
          await sleep(BACKOFFS[attempt]);
          continue;
        }
        throw new Error(`groq ${res.status}`);
      }
      const data = (await res.json()) as any;
      return data?.choices?.[0]?.message?.content || "";
    }
    throw new Error("groq unreachable");
  }
}
