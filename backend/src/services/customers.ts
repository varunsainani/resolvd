import type { Prisma } from "@prisma/client";

// Build the WHERE clause for a customer directory search. An empty query
// matches everyone; otherwise it does a case-insensitive contains across name,
// email, and company. Kept pure so the matching rules are unit tested.
export function customerSearchWhere(search: string): Prisma.CustomerWhereInput {
  const q = search.trim();
  if (!q) return {};
  return {
    OR: [
      { name: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
      { company: { contains: q, mode: "insensitive" } },
    ],
  };
}
