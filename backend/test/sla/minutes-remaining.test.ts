import { describe, expect, it } from "vitest";

import { minutesRemaining } from "../../src/lib/sla";

const now = new Date("2026-01-01T12:00:00.000Z");

describe("minutesRemaining", () => {
  it("is positive before the deadline", () => {
    expect(minutesRemaining(new Date("2026-01-01T13:00:00Z"), now)).toBe(60);
  });

  it("is negative after the deadline", () => {
    expect(minutesRemaining(new Date("2026-01-01T11:30:00Z"), now)).toBe(-30);
  });

  it("is null when there is no deadline", () => {
    expect(minutesRemaining(null, now)).toBeNull();
  });
});
