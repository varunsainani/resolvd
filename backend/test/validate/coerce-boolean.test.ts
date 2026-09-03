import { describe, expect, it } from "vitest";

import { coerceBoolean } from "../../src/lib/validate";

describe("coerceBoolean", () => {
  it("passes real booleans through", () => {
    expect(coerceBoolean(true)).toBe(true);
    expect(coerceBoolean(false)).toBe(false);
  });

  it("reads falsy strings as false", () => {
    expect(coerceBoolean("false")).toBe(false);
    expect(coerceBoolean("0")).toBe(false);
    expect(coerceBoolean("")).toBe(false);
    expect(coerceBoolean("  FALSE ")).toBe(false);
  });

  it("reads other non-empty strings as true", () => {
    expect(coerceBoolean("true")).toBe(true);
    expect(coerceBoolean("on")).toBe(true);
  });

  it("coerces undefined and null to false", () => {
    expect(coerceBoolean(undefined)).toBe(false);
    expect(coerceBoolean(null)).toBe(false);
  });
});
