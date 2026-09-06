import { describe, expect, it } from "vitest";

import { formatDate, formatDateTime } from "@/lib/format";

const iso = "2026-09-06T15:04:00Z";

describe("formatDate / formatDateTime", () => {
  it("renders a medium date including the year", () => {
    const out = formatDate(iso, "en");
    expect(out).toMatch(/2026/);
    expect(typeof out).toBe("string");
  });

  it("renders date and time together", () => {
    const out = formatDateTime(iso, "en");
    expect(out).toMatch(/2026/);
    // Includes a time component (has a digit followed by ":").
    expect(out).toMatch(/\d:\d\d/);
  });

  it("accepts a Date object too", () => {
    expect(formatDate(new Date(iso), "en")).toMatch(/2026/);
  });
});
