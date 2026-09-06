import { describe, expect, it } from "vitest";

import { formatNumber } from "@/lib/format";

describe("formatNumber", () => {
  it("groups thousands in English", () => {
    expect(formatNumber(1234, "en")).toBe("1,234");
  });

  it("leaves small numbers unchanged", () => {
    expect(formatNumber(42, "en")).toBe("42");
  });
});
