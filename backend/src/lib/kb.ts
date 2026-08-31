import type { KbArticle } from "@prisma/client";

import { keywordSet, tokenize } from "./text";

export interface ScoredArticle {
  article: KbArticle;
  score: number;
}

// Score a single article against a set of query keywords. Title and the
// curated `keywords` field are weighted higher than the body because they are
// the human-picked signal for what a ticket is about.
function scoreArticle(article: KbArticle, query: Set<string>): number {
  if (query.size === 0) return 0;
  const title = keywordSet(article.title);
  const keywords = keywordSet(article.keywords);
  const body = keywordSet(article.body);
  let score = 0;
  for (const term of query) {
    if (keywords.has(term)) score += 3;
    else if (title.has(term)) score += 2;
    else if (body.has(term)) score += 1;
  }
  return score;
}

// Rank knowledge base articles by keyword overlap with the ticket text and
// return the most relevant few. Deterministic and offline, so it grounds the
// AI reply whether or not the model call succeeds.
export function retrieveArticles(
  articles: KbArticle[],
  queryText: string,
  limit = 3,
): KbArticle[] {
  const query = new Set(tokenize(queryText));
  const scored: ScoredArticle[] = articles
    .map((article) => ({ article, score: scoreArticle(article, query) }))
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.article);
}
