import type { Prisma } from "@prisma/client";

// WHERE builder for canned responses. Search is a case-insensitive contains
// over title and body, with an optional category filter. Pure and unit tested.
export function cannedSearchWhere(search: string, category?: string): Prisma.CannedResponseWhereInput {
  const where: Prisma.CannedResponseWhereInput = {};
  const q = search.trim();
  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { body: { contains: q, mode: "insensitive" } },
    ];
  }
  const cat = category?.trim();
  if (cat) where.category = cat;
  return where;
}
