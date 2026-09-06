import { describe, expect, it } from "vitest";

import { parseReference } from "../../src/lib/reference";

describe("parseReference", () => {
  it("accepts a bare number string", () => {
    expect(parseReference("1042")).toBe(1042);
  });

  it("strips a leading # and surrounding space", () => {
    expect(parseReference(" #1042 ")).toBe(1042);
  });

  it("accepts an actual number", () => {
    expect(parseReference(1042)).toBe(1042);
  });

  it("rejects zero, negatives, and non-integers", () => {
    expect(parseReference("0")).toBeNull();
    expect(parseReference("-5")).toBeNull();
    expect(parseReference("3.5")).toBeNull();
  });

  it("rejects non-numeric and non-string/number input", () => {
    expect(parseReference("abc")).toBeNull();
    expect(parseReference(undefined)).toBeNull();
    expect(parseReference(null)).toBeNull();
    expect(parseReference({})).toBeNull();
  });
});
