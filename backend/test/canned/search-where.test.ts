import { describe, expect, it } from "vitest";

import { cannedSearchWhere } from "../../src/services/canned";

describe("cannedSearchWhere", () => {
  it("is empty with no search and no category", () => {
    expect(cannedSearchWhere("")).toEqual({});
  });

  it("searches title and body case-insensitively", () => {
    const where = cannedSearchWhere("password");
    expect(where.OR).toEqual([
      { title: { contains: "password", mode: "insensitive" } },
      { body: { contains: "password", mode: "insensitive" } },
    ]);
  });

  it("adds a category filter when provided", () => {
    expect(cannedSearchWhere("", "Account").category).toBe("Account");
  });
});
