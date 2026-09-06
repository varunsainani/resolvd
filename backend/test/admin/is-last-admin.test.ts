import { describe, expect, it } from "vitest";

import { isLastAdmin } from "../../src/services/admin";

describe("isLastAdmin", () => {
  it("is true when the target is the only admin", () => {
    expect(isLastAdmin(["a1"], "a1")).toBe(true);
  });

  it("is false when another admin remains", () => {
    expect(isLastAdmin(["a1", "a2"], "a1")).toBe(false);
  });

  it("is false when the target is not an admin", () => {
    expect(isLastAdmin(["a1"], "someone-else")).toBe(false);
  });

  it("is false when there are no admins at all", () => {
    expect(isLastAdmin([], "a1")).toBe(false);
  });
});
