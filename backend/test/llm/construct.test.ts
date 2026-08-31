import { describe, expect, it } from "vitest";

import { GeminiProvider } from "../../src/llm/gemini";
import { GroqProvider } from "../../src/llm/groq";

describe("provider construction", () => {
  it("names the Groq provider", () => {
    expect(new GroqProvider("key", "model").name).toBe("groq");
  });

  it("names the Gemini provider", () => {
    expect(new GeminiProvider("key", "model").name).toBe("gemini");
  });
});
