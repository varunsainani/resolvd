import { describe, expect, it } from "vitest";

import { breakdownColor } from "@/lib/breakdown-colors";

describe("breakdownColor", () => {
  it("maps status/priority/sentiment keys to their badge tones", () => {
    expect(breakdownColor("status", "RESOLVED")).toBe("bg-success");
    expect(breakdownColor("priority", "URGENT")).toBe("bg-danger");
    expect(breakdownColor("sentiment", "NEGATIVE")).toBe("bg-danger");
  });

  it("falls back to the brand color for channel/category", () => {
    expect(breakdownColor("channel", "EMAIL")).toBe("bg-primary");
    expect(breakdownColor("category", "billing")).toBe("bg-primary");
  });

  it("falls back to the brand color for an unknown key", () => {
    expect(breakdownColor("status", "MYSTERY")).toBe("bg-primary");
  });
});
