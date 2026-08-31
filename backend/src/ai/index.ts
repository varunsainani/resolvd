// Public surface of the AI layer. Routes import from here so the internal
// module split (providers, prompts, fallbacks) can change freely.
export { triageTicket } from "./triage";
export type { TriageInput, TriageResult } from "./triage";
export { suggestReply } from "./suggest";
export type { SuggestInput, SuggestMessage, SuggestResult } from "./suggest";
export { retrieveArticles } from "../lib/kb";
