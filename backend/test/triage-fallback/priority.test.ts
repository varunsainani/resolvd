import { describe, expect, it } from "vitest";

import { fallbackPriority } from "../../src/ai/triage-fallback";

describe("fallbackPriority", () => {
  it("flags urgent language as URGENT", () => {
    expect(fallbackPriority("This is urgent, the system is down")).toBe("URGENT");
  });

  it("treats a security breach as URGENT", () => {
    expect(fallbackPriority("possible security breach on my account")).toBe("URGENT");
  });

  it("flags broken/error language as HIGH", () => {
    expect(fallbackPriority("the checkout is broken and throwing an error")).toBe("HIGH");
  });

  it("treats a how-to question as LOW", () => {
    expect(fallbackPriority("quick question, how do i change my avatar")).toBe("LOW");
  });

  it("defaults to NORMAL when nothing matches", () => {
    expect(fallbackPriority("just checking in about my order")).toBe("NORMAL");
  });
});
