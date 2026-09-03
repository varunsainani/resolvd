import { beforeEach, describe, expect, it } from "vitest";

import { hitDailyLimit, resetDailyLimits } from "../../src/lib/rate-limit";

describe("hitDailyLimit", () => {
  beforeEach(() => resetDailyLimits());

  it("allows up to the maximum, then blocks", () => {
    const now = new Date("2026-09-03T10:00:00Z");
    expect(hitDailyLimit("suggest:u1", 3, now)).toBe(false);
    expect(hitDailyLimit("suggest:u1", 3, now)).toBe(false);
    expect(hitDailyLimit("suggest:u1", 3, now)).toBe(false);
    expect(hitDailyLimit("suggest:u1", 3, now)).toBe(true);
  });

  it("tracks separate keys independently", () => {
    const now = new Date("2026-09-03T10:00:00Z");
    expect(hitDailyLimit("suggest:u1", 1, now)).toBe(false);
    expect(hitDailyLimit("suggest:u1", 1, now)).toBe(true);
    // A different agent still has their full allowance.
    expect(hitDailyLimit("suggest:u2", 1, now)).toBe(false);
  });
});
