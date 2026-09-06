import { describe, expect, it } from "vitest";

import { customerOrderBy } from "../../src/services/customers";

describe("customerOrderBy", () => {
  it("defaults to newest first", () => {
    expect(customerOrderBy(undefined)).toEqual({ createdAt: "desc" });
    expect(customerOrderBy("anything-unknown")).toEqual({ createdAt: "desc" });
  });

  it("sorts by name ascending", () => {
    expect(customerOrderBy("name")).toEqual({ name: "asc" });
  });

  it("sorts by ticket count descending", () => {
    expect(customerOrderBy("tickets")).toEqual({ tickets: { _count: "desc" } });
  });
});
