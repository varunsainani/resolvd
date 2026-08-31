import { config } from "../config";
import { LLMProvider } from "./base";
import { GeminiProvider } from "./gemini";
import { GroqProvider } from "./groq";
import { MockProvider } from "./mock";

// Resolves the active provider from config. Falls back to the mock provider
// whenever the selected provider has no key configured, so the AI features
// degrade gracefully instead of throwing at startup.
export function getProvider(): LLMProvider {
  const p = config.llmProvider;
  if (p === "mock") return new MockProvider();
  if (p === "groq" && config.groqApiKey) return new GroqProvider(config.groqApiKey, config.groqModel);
  if (p === "gemini" && config.geminiApiKey) return new GeminiProvider(config.geminiApiKey, config.geminiModel);
  return new MockProvider();
}

export type { LLMProvider } from "./base";
