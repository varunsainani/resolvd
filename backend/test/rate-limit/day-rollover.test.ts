import { beforeEach, describe, expect, it } from "vitest";

import { dayKey, hitDailyLimit, resetDailyLimits } from "../../src/lib/rate-limit";

describe("daily limit rollover", () => {
  beforeEach(() => resetDailyLimits());

  it("dayKey is the UTC calendar date", () => {
    expect(dayKey(new Date("2026-09-03T23:59:00Z"))).toBe("2026-09-03");
  });

  it("resets the counter when the day changes", () => {
    const day1 = new Date("2026-09-03T10:00:00Z");
    expect(hitDailyLimit("suggest:u1", 1, day1)).toBe(false);
    expect(hitDailyLimit("suggest:u1", 1, day1)).toBe(true);

    const day2 = new Date("2026-09-04T00:01:00Z");
    expect(hitDailyLimit("suggest:u1", 1, day2)).toBe(false);
  });
});
