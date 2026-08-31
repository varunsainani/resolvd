import { describe, expect, it } from "vitest";

import { fallbackCategory } from "../../src/ai/triage-fallback";

describe("fallbackCategory", () => {
  it("maps invoice/refund language to Billing", () => {
    expect(fallbackCategory("I need a refund for a duplicate invoice")).toBe("Billing");
  });

  it("maps crash/error language to Bug", () => {
    expect(fallbackCategory("the app keeps throwing a 500 error and crashes")).toBe("Bug");
  });

  it("maps login/password language to Account", () => {
    expect(fallbackCategory("I am locked out and cannot reset my password")).toBe("Account");
  });

  it("maps api/webhook language to Integration", () => {
    expect(fallbackCategory("my webhook stopped receiving api events")).toBe("Integration");
  });

  it("defaults to General when nothing matches", () => {
    expect(fallbackCategory("hello, I have a small comment")).toBe("General");
  });
});
