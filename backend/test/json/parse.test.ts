import { describe, expect, it } from "vitest";

import { parseJsonObject } from "../../src/ai/json";

describe("parseJsonObject", () => {
  it("parses a valid object", () => {
    expect(parseJsonObject('{"priority":"HIGH"}')).toEqual({ priority: "HIGH" });
  });

  it("parses an object wrapped in a fenced block", () => {
    expect(parseJsonObject('```json\n{"ok":true}\n```')).toEqual({ ok: true });
  });

  it("returns null for malformed JSON", () => {
    expect(parseJsonObject("{not valid}")).toBeNull();
  });

  it("returns null for an empty string", () => {
    expect(parseJsonObject("")).toBeNull();
  });
});
