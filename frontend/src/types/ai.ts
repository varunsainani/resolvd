// AI suggested reply (suggestReply) from POST /api/tickets/:id/suggest.
export interface SuggestResult {
  reply: string;
  usedArticles: { id: string; title: string }[];
  source: "ai" | "fallback";
}
