import { describe, expect, it } from "vitest";

import { normalizeWhitespace } from "../../src/lib/text";

describe("normalizeWhitespace", () => {
  it("collapses runs of spaces but keeps single newlines", () => {
    expect(normalizeWhitespace("hello    world\nfoo")).toBe("hello world\nfoo");
  });

  it("caps three or more blank lines at one blank line", () => {
    expect(normalizeWhitespace("a\n\n\n\nb")).toBe("a\n\nb");
  });

  it("trims leading and trailing whitespace", () => {
    expect(normalizeWhitespace("  padded  ")).toBe("padded");
  });
});
