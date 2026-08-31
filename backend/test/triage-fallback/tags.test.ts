import { describe, expect, it } from "vitest";

import { fallbackTags } from "../../src/ai/triage-fallback";

describe("fallbackTags", () => {
  it("derives tags from known vocabulary", () => {
    const tags = fallbackTags("I was charged twice and cannot log in");
    expect(tags).toContain("payment");
    expect(tags).toContain("login");
  });

  it("caps the number of tags at three", () => {
    const tags = fallbackTags("urgent refund payment login outage bug api");
    expect(tags.length).toBeLessThanOrEqual(3);
  });

  it("returns an empty array when nothing matches", () => {
    expect(fallbackTags("hello there")).toEqual([]);
  });
});
