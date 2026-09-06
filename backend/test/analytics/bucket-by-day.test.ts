import { describe, expect, it } from "vitest";

import { bucketByDay, dayKeyUTC } from "../../src/lib/analytics";

const now = new Date("2026-01-10T12:00:00Z");

describe("bucketByDay", () => {
  it("returns one zero-filled entry per day in chronological order", () => {
    const series = bucketByDay([], 7, now);
    expect(series).toHaveLength(7);
    expect(series[0].date).toBe("2026-01-04");
    expect(series[6].date).toBe("2026-01-10");
    expect(series.every((s) => s.count === 0)).toBe(true);
  });

  it("counts dates into their UTC day bucket", () => {
    const dates = [
      new Date("2026-01-10T01:00:00Z"),
      new Date("2026-01-10T23:00:00Z"),
      new Date("2026-01-08T10:00:00Z"),
    ];
    const series = bucketByDay(dates, 7, now);
    expect(series.find((s) => s.date === "2026-01-10")?.count).toBe(2);
    expect(series.find((s) => s.date === "2026-01-08")?.count).toBe(1);
  });

  it("ignores dates outside the window", () => {
    const dates = [new Date("2025-12-01T00:00:00Z")];
    const series = bucketByDay(dates, 7, now);
    expect(series.reduce((a, s) => a + s.count, 0)).toBe(0);
  });

  it("dayKeyUTC slices to a YYYY-MM-DD key", () => {
    expect(dayKeyUTC(new Date("2026-01-10T23:59:59Z"))).toBe("2026-01-10");
  });
});
