// Shared contract for every LLM provider. Each implementation takes a system
// and user prompt and returns the raw model text, which the AI layer expects to
// be a single JSON object string. Providers never parse or validate; that is
// the caller's job so the same provider can back triage and suggested replies.
export interface LLMProvider {
  name: string;
  complete(system: string, user: string): Promise<string>;
}

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Transient HTTP statuses worth a retry (rate limit + upstream hiccups).
export const RETRY_STATUSES = new Set([429, 500, 502, 503]);

// Backoff schedule in ms. Length also sets the retry count (two retries here).
export const BACKOFFS = [2500, 6000];
