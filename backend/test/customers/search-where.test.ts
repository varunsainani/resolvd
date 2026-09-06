import { describe, expect, it } from "vitest";

import { customerSearchWhere } from "../../src/services/customers";

describe("customerSearchWhere", () => {
  it("matches everyone for an empty or whitespace query", () => {
    expect(customerSearchWhere("")).toEqual({});
    expect(customerSearchWhere("   ")).toEqual({});
  });

  it("builds a case-insensitive OR across name, email, and company", () => {
    const where = customerSearchWhere("  Acme ");
    expect(where.OR).toEqual([
      { name: { contains: "Acme", mode: "insensitive" } },
      { email: { contains: "Acme", mode: "insensitive" } },
      { company: { contains: "Acme", mode: "insensitive" } },
    ]);
  });
});
