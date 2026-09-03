import { describe, expect, it } from "vitest";

import { optionalString } from "../../src/lib/validate";

describe("optionalString", () => {
  it("trims a present value", () => {
    expect(optionalString("  Acme Co  ")).toBe("Acme Co");
  });

  it("returns undefined for a blank string", () => {
    expect(optionalString("   ")).toBeUndefined();
  });

  it("returns undefined for non-string input", () => {
    expect(optionalString(undefined)).toBeUndefined();
    expect(optionalString(null)).toBeUndefined();
    expect(optionalString(5)).toBeUndefined();
  });
});
