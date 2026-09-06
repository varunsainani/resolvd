import { describe, expect, it } from "vitest";

import { initials } from "@/lib/format";

describe("initials", () => {
  it("takes the first two words' initials, uppercased", () => {
    expect(initials("Dana Ruiz")).toBe("DR");
  });

  it("handles a single name", () => {
    expect(initials("cher")).toBe("C");
  });

  it("ignores extra whitespace and words beyond two", () => {
    expect(initials("  ana   bela  cid ")).toBe("AB");
  });
});
