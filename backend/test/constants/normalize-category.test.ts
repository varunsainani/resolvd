import { describe, expect, it } from "vitest";

import { normalizeCategory } from "../../src/lib/constants";

describe("normalizeCategory", () => {
  it("matches a known category case-insensitively", () => {
    expect(normalizeCategory("billing")).toBe("Billing");
    expect(normalizeCategory("  FEATURE REQUEST ")).toBe("Feature Request");
  });

  it("falls back to General for unknown input", () => {
    expect(normalizeCategory("Nonsense")).toBe("General");
    expect(normalizeCategory(123)).toBe("General");
  });
});
