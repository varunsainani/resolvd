import { describe, expect, it } from "vitest";

import { formatDayLabel } from "@/lib/format";

describe("formatDayLabel", () => {
  it("formats a UTC day key as month + day", () => {
    expect(formatDayLabel("2026-09-06", "en")).toBe("Sep 6");
  });

  it("does not shift the day across timezones", () => {
    // Midnight-UTC parsing keeps the 1st the 1st regardless of the local zone.
    expect(formatDayLabel("2026-01-01", "en")).toBe("Jan 1");
  });
});
