import { describe, expect, it } from "vitest";

import { cannedOrderBy } from "../../src/services/canned";

describe("cannedOrderBy", () => {
  it("defaults to alphabetical by title", () => {
    expect(cannedOrderBy(undefined)).toEqual({ title: "asc" });
    expect(cannedOrderBy("title")).toEqual({ title: "asc" });
  });

  it("sorts by most recently created", () => {
    expect(cannedOrderBy("recent")).toEqual({ createdAt: "desc" });
  });
});
