import { describe, expect, it } from "vitest";

import { toQuery } from "@/lib/api";

describe("toQuery", () => {
  it("is empty for no params or all-empty params", () => {
    expect(toQuery()).toBe("");
    expect(toQuery({ a: undefined, b: null, c: "" })).toBe("");
  });

  it("builds a query string, skipping empty values", () => {
    expect(toQuery({ q: "dana", page: 2, empty: "" })).toBe("?q=dana&page=2");
  });

  it("encodes special characters", () => {
    expect(toQuery({ email: "a b@c.com" })).toBe("?email=a+b%40c.com");
  });
});
