# AI layer

The AI layer turns an incoming ticket into structured triage and a grounded
draft reply. It is built so the demo keeps working even with no model key: every
entry point falls back to deterministic logic and never throws.

## Providers (`src/llm/`)

- `LLMProvider` is a single `complete(system, user) => Promise<string>` contract.
- `GroqProvider` (default, `openai/gpt-oss-120b`) and `GeminiProvider`
  (`gemini-flash-latest`) both request JSON output and retry transient errors.
- `MockProvider` returns an empty string, which routes callers to their fallback.
- `getProvider()` reads `LLM_PROVIDER` and degrades to the mock provider when the
  selected provider has no key.

Switch providers with the `LLM_PROVIDER` env var (`groq` | `gemini` | `mock`).

## Triage (`src/ai/triage.ts`)

`triageTicket(input, provider?)` returns `{ priority, category, tags, sentiment,
summary, source }`. The model output is JSON-parsed, zod-validated, and each field
is normalized against the known enums. Anything missing or invalid is filled from
the keyword heuristics in `triage-fallback.ts`, so `source` reports `ai` or
`fallback`.

## Suggested reply (`src/ai/suggest.ts`)

`suggestReply(input, provider?)` drafts an agent reply grounded in the knowledge
base articles retrieved by `lib/kb.ts` (keyword overlap, title/keywords weighted
above body). The prompt forbids inventing product specifics. On failure it returns
a localized EN/ES/PT template that references the top matched article.

## Testing

Both orchestrators accept an optional `provider` argument so tests inject a stub
without any network call. Run the suite with `npm test`.
