import { describe, expect, it } from "vitest";

import { clamp } from "../../src/lib/text";

describe("clamp with no word boundary", () => {
  it("hard-cuts a single long word and appends an ellipsis", () => {
    const out = clamp("supercalifragilisticexpialidocious", 10);
    expect(out).toBe("supercali…");
    expect(out.length).toBe(10);
  });
});
