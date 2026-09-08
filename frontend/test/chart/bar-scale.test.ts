import { describe, expect, it } from "vitest";

import { barPercent, maxCount } from "@/lib/chart";

describe("maxCount", () => {
  it("returns the largest count", () => {
    expect(maxCount([{ count: 2 }, { count: 9 }, { count: 5 }])).toBe(9);
  });

  it("returns 0 for an empty series", () => {
    expect(maxCount([])).toBe(0);
  });
});

describe("barPercent", () => {
  it("scales against the max", () => {
    expect(barPercent(5, 10)).toBe(50);
    expect(barPercent(10, 10)).toBe(100);
  });

  it("returns 0 when max is zero or negative", () => {
    expect(barPercent(3, 0)).toBe(0);
    expect(barPercent(3, -2)).toBe(0);
  });

  it("clamps to the 0..100 range", () => {
    expect(barPercent(20, 10)).toBe(100);
    expect(barPercent(-5, 10)).toBe(0);
  });
});
