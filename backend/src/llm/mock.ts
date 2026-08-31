import { LLMProvider } from "./base";

// Returns an empty string so the AI layer falls back to its deterministic
// heuristics. Used in local/offline runs and whenever no API key is set, which
// keeps the demo fully functional without any external calls.
export class MockProvider implements LLMProvider {
  name = "mock";
  async complete(): Promise<string> {
    return "";
  }
}
