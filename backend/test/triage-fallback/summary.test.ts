import { describe, expect, it } from "vitest";

import { fallbackSummary } from "../../src/ai/triage-fallback";

describe("fallbackSummary", () => {
  it("uses the first sentence of the message", () => {
    const out = fallbackSummary("Payment issue", "The payment page keeps rejecting my card. Please help.");
    expect(out).toBe("The payment page keeps rejecting my card.");
  });

  it("falls back to the subject when the message is too thin", () => {
    const out = fallbackSummary("Billing question", "Hi.");
    expect(out).toBe("Billing question");
  });

  it("clamps a very long first sentence", () => {
    const long = "word ".repeat(60).trim() + ".";
    const out = fallbackSummary("Subject", long);
    expect(out.length).toBeLessThanOrEqual(141);
    expect(out.endsWith("…")).toBe(true);
  });
});
