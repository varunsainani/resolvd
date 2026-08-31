import { BACKOFFS, LLMProvider, RETRY_STATUSES, sleep } from "./base";

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent";

// Gemini alternative provider. responseMimeType forces JSON so the same parsers
// work whether Groq or Gemini is configured. Kept switchable via LLM_PROVIDER.
export class GeminiProvider implements LLMProvider {
  name = "gemini";
  constructor(private apiKey: string, private model: string) {}

  async complete(system: string, user: string): Promise<string> {
    const url = GEMINI_URL.replace("{model}", this.model) + `?key=${this.apiKey}`;
    const body = {
      system_instruction: { parts: [{ text: system }] },
      contents: [{ role: "user", parts: [{ text: user }] }],
      generationConfig: {
        temperature: 0.4,
        responseMimeType: "application/json",
        maxOutputTokens: 2048,
      },
    };
    for (let attempt = 0; attempt <= BACKOFFS.length; attempt++) {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        if (RETRY_STATUSES.has(res.status) && attempt < BACKOFFS.length) {
          await sleep(BACKOFFS[attempt]);
          continue;
        }
        throw new Error(`gemini ${res.status}`);
      }
      const data = (await res.json()) as any;
      const parts = data?.candidates?.[0]?.content?.parts || [];
      return parts.map((p: any) => p.text || "").join("");
    }
    throw new Error("gemini unreachable");
  }
}
