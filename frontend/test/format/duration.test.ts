import { describe, expect, it } from "vitest";

import { formatDuration } from "@/lib/format";

describe("formatDuration", () => {
  it("shows minutes under an hour", () => {
    expect(formatDuration(40)).toBe("40m");
  });

  it("combines hours and minutes", () => {
    expect(formatDuration(135)).toBe("2h 15m");
  });

  it("shows days and hours for long spans, capped at two units", () => {
    expect(formatDuration(3000)).toBe("2d 2h");
  });

  it("renders 0m for zero or negative input", () => {
    expect(formatDuration(0)).toBe("0m");
    expect(formatDuration(-99)).toBe("0m");
  });
});
