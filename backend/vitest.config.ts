import { defineConfig } from "vitest/config";

// Unit tests cover the AI layer's deterministic pieces (tokenizer, KB
// retrieval, JSON extraction, triage fallbacks, reply fallbacks). No network
// or database: the LLM is exercised through the mock provider.
export default defineConfig({
  test: {
    include: ["test/**/*.test.ts"],
    environment: "node",
  },
});
