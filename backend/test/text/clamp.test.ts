import { describe, expect, it } from "vitest";

import { clamp } from "../../src/lib/text";

describe("clamp", () => {
  it("leaves text shorter than the max untouched", () => {
    expect(clamp("short", 20)).toBe("short");
  });

  it("truncates and appends an ellipsis when over the max", () => {
    const out = clamp("the quick brown fox jumps over", 15);
    expect(out.endsWith("…")).toBe(true);
    expect(out.length).toBeLessThanOrEqual(15);
  });

  it("prefers cutting at a word boundary", () => {
    const out = clamp("alpha beta gamma delta", 14);
    expect(out).toBe("alpha beta…");
  });
});
