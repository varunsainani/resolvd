import { describe, expect, it } from "vitest";

import { formatRelativeTime } from "@/lib/format";

const now = new Date("2026-01-10T12:00:00Z");

describe("formatRelativeTime", () => {
  it("describes a past timestamp with the largest fitting unit", () => {
    const out = formatRelativeTime(new Date("2026-01-10T10:00:00Z"), "en", now);
    // 2 hours ago -> mentions "2" and an hour unit; exact ICU wording varies.
    expect(out).toMatch(/2/);
    expect(out.toLowerCase()).toMatch(/h|hour/);
  });

  it("describes a future timestamp", () => {
    const out = formatRelativeTime(new Date("2026-01-13T12:00:00Z"), "en", now);
    expect(out).toMatch(/3/);
    expect(out.toLowerCase()).toMatch(/d|day/);
  });

  it("always returns a non-empty string", () => {
    expect(formatRelativeTime(now, "en", now).length).toBeGreaterThan(0);
  });
});
