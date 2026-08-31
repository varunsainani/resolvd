import type { LLMProvider } from "../src/llm/base";

// A provider that returns a fixed string, so orchestrator tests exercise the
// parse/normalize path without any network call.
export function stubProvider(output: string): LLMProvider {
  return { name: "stub", complete: async () => output };
}

// A provider that throws, to exercise the deterministic fallback path.
export function throwingProvider(): LLMProvider {
  return {
    name: "throwing",
    complete: async () => {
      throw new Error("provider down");
    },
  };
}
