import { describe, expect, it } from "vitest";

import { colorForTag } from "../../src/lib/constants";

describe("colorForTag", () => {
  it("returns the stable color for a known tag", () => {
    expect(colorForTag("urgent")).toBe("#dc2626");
    expect(colorForTag("VIP")).toBe("#9333ea");
  });

  it("returns a neutral color for an unknown tag", () => {
    expect(colorForTag("whatever")).toBe("#64748b");
  });
});
