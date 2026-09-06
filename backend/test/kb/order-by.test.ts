import { describe, expect, it } from "vitest";

import { kbOrderBy } from "../../src/services/kb";

describe("kbOrderBy", () => {
  it("defaults to most recently updated", () => {
    expect(kbOrderBy(undefined)).toEqual({ updatedAt: "desc" });
    expect(kbOrderBy("nonsense")).toEqual({ updatedAt: "desc" });
  });

  it("sorts by title ascending", () => {
    expect(kbOrderBy("title")).toEqual({ title: "asc" });
  });

  it("sorts by oldest created", () => {
    expect(kbOrderBy("oldest")).toEqual({ createdAt: "asc" });
  });
});
