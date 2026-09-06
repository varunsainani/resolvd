import { describe, expect, it } from "vitest";

import { normalizeTagName } from "../../src/lib/tags";

describe("normalizeTagName", () => {
  it("lowercases and trims", () => {
    expect(normalizeTagName("  Urgent ")).toBe("urgent");
  });

  it("hyphenates internal whitespace", () => {
    expect(normalizeTagName("How To")).toBe("how-to");
    expect(normalizeTagName("feature   request")).toBe("feature-request");
  });

  it("leaves already-normalised tags unchanged", () => {
    expect(normalizeTagName("how-to")).toBe("how-to");
  });

  it("returns empty string for blank or non-string input", () => {
    expect(normalizeTagName("   ")).toBe("");
    expect(normalizeTagName(undefined)).toBe("");
    expect(normalizeTagName(42)).toBe("");
  });
});
