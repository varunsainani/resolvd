import type { Prisma } from "@prisma/client";

// WHERE builder for the knowledge base list. Search does a case-insensitive
// contains over title, the curated keywords, and the body; an optional category
// narrows it further. Pure so the filter logic can be unit tested.
export function kbSearchWhere(search: string, category?: string): Prisma.KbArticleWhereInput {
  const where: Prisma.KbArticleWhereInput = {};
  const q = search.trim();
  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { keywords: { contains: q, mode: "insensitive" } },
      { body: { contains: q, mode: "insensitive" } },
    ];
  }
  const cat = category?.trim();
  if (cat) where.category = cat;
  return where;
}

// Map the `sort` query into a Prisma orderBy for the KB list. Default is most
// recently updated first (freshest guidance on top).
export function kbOrderBy(sort: unknown): Prisma.KbArticleOrderByWithRelationInput {
  switch (sort) {
    case "title":
      return { title: "asc" };
    case "oldest":
      return { createdAt: "asc" };
    default:
      return { updatedAt: "desc" };
  }
}
