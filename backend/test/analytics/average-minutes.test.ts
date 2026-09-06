import { describe, expect, it } from "vitest";

import { averageMinutes } from "../../src/lib/analytics";

const at = (iso: string) => new Date(iso);

describe("averageMinutes", () => {
  it("averages the gap in whole minutes", () => {
    const pairs = [
      { start: at("2026-01-01T00:00:00Z"), end: at("2026-01-01T00:30:00Z") }, // 30
      { start: at("2026-01-01T00:00:00Z"), end: at("2026-01-01T01:30:00Z") }, // 90
    ];
    expect(averageMinutes(pairs)).toBe(60);
  });

  it("skips pairs with a missing end", () => {
    const pairs = [
      { start: at("2026-01-01T00:00:00Z"), end: at("2026-01-01T00:20:00Z") }, // 20
      { start: at("2026-01-01T00:00:00Z"), end: null },
    ];
    expect(averageMinutes(pairs)).toBe(20);
  });

  it("ignores negative spans as bad data", () => {
    const pairs = [
      { start: at("2026-01-01T01:00:00Z"), end: at("2026-01-01T00:00:00Z") },
      { start: at("2026-01-01T00:00:00Z"), end: at("2026-01-01T00:40:00Z") }, // 40
    ];
    expect(averageMinutes(pairs)).toBe(40);
  });

  it("returns null when nothing qualifies", () => {
    expect(averageMinutes([])).toBeNull();
    expect(averageMinutes([{ start: null, end: null }])).toBeNull();
  });
});
