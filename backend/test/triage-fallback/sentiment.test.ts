import { describe, expect, it } from "vitest";

import { fallbackSentiment } from "../../src/ai/triage-fallback";

describe("fallbackSentiment", () => {
  it("detects negative language", () => {
    expect(fallbackSentiment("This is terrible and I am so frustrated")).toBe("NEGATIVE");
  });

  it("detects positive language", () => {
    expect(fallbackSentiment("Thanks so much, this was really helpful")).toBe("POSITIVE");
  });

  it("returns NEUTRAL when there is no strong signal", () => {
    expect(fallbackSentiment("I have a question about my plan")).toBe("NEUTRAL");
  });
});
