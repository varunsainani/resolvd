import { describe, expect, it } from "vitest";

import { extractJson } from "../../src/ai/json";

describe("extractJson", () => {
  it("returns a plain JSON object unchanged", () => {
    expect(extractJson('{"a":1}')).toBe('{"a":1}');
  });

  it("unwraps a fenced code block", () => {
    expect(extractJson('```json\n{"a":1}\n```')).toBe('{"a":1}');
  });

  it("strips prose surrounding the object", () => {
    expect(extractJson('Here you go: {"a":1} thanks')).toBe('{"a":1}');
  });

  it("returns the trimmed text when there is no object to slice", () => {
    expect(extractJson("no json here")).toBe("no json here");
  });
});
