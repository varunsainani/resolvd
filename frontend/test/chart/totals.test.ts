import { describe, expect, it } from "vitest";

import { hasData, sharePercent, totalCount } from "@/lib/chart";

describe("totalCount", () => {
  it("sums all counts", () => {
    expect(totalCount([{ count: 2 }, { count: 3 }, { count: 5 }])).toBe(10);
  });

  it("is 0 for an empty series", () => {
    expect(totalCount([])).toBe(0);
  });
});

describe("sharePercent", () => {
  it("computes a value's share of the total", () => {
    expect(sharePercent(1, 4)).toBe(25);
  });

  it("returns 0 when the total is non-positive", () => {
    expect(sharePercent(1, 0)).toBe(0);
  });
});

describe("hasData", () => {
  it("is true only when some count is positive", () => {
    expect(hasData([{ count: 0 }, { count: 0 }])).toBe(false);
    expect(hasData([{ count: 0 }, { count: 1 }])).toBe(true);
    expect(hasData([])).toBe(false);
  });
});
