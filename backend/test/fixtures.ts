import type { KbArticle } from "@prisma/client";

// Build a KbArticle-shaped object for tests without touching the database.
export function makeArticle(partial: Partial<KbArticle> & { title: string }): KbArticle {
  const now = new Date("2026-01-01T00:00:00Z");
  return {
    id: partial.id || partial.title.toLowerCase().replace(/\s+/g, "-"),
    title: partial.title,
    body: partial.body || "",
    category: partial.category || "General",
    keywords: partial.keywords || "",
    createdAt: partial.createdAt || now,
    updatedAt: partial.updatedAt || now,
  };
}
