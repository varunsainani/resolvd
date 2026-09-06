import { describe, expect, it } from "vitest";

import { kbSearchWhere } from "../../src/services/kb";

describe("kbSearchWhere", () => {
  it("is empty with no search and no category", () => {
    expect(kbSearchWhere("")).toEqual({});
  });

  it("searches title, keywords, and body case-insensitively", () => {
    const where = kbSearchWhere(" refund ");
    expect(where.OR).toEqual([
      { title: { contains: "refund", mode: "insensitive" } },
      { keywords: { contains: "refund", mode: "insensitive" } },
      { body: { contains: "refund", mode: "insensitive" } },
    ]);
  });

  it("adds a category filter when provided", () => {
    expect(kbSearchWhere("", "Billing").category).toBe("Billing");
    expect(kbSearchWhere("", "  ").category).toBeUndefined();
  });

  it("combines search and category", () => {
    const where = kbSearchWhere("charge", "Billing");
    expect(where.category).toBe("Billing");
    expect(where.OR).toHaveLength(3);
  });
});
