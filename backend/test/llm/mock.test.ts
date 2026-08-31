import { describe, expect, it } from "vitest";

import { MockProvider } from "../../src/llm/mock";

describe("MockProvider", () => {
  it("is named mock", () => {
    expect(new MockProvider().name).toBe("mock");
  });

  it("returns an empty string so callers use their fallback", async () => {
    expect(await new MockProvider().complete()).toBe("");
  });
});
