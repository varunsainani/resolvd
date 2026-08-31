import { describe, expect, it } from "vitest";

import { keywordSet } from "../../src/lib/text";

describe("keywordSet", () => {
  it("returns a Set of unique meaningful tokens", () => {
    const set = keywordSet("refund refund refund payment");
    expect(set).toBeInstanceOf(Set);
    expect([...set].sort()).toEqual(["payment", "refund"]);
  });

  it("excludes stopwords from the set", () => {
    const set = keywordSet("the invoice is wrong");
    expect(set.has("the")).toBe(false);
    expect(set.has("invoice")).toBe(true);
  });
});
