import { describe, expect, it } from "vitest";

import { ApiError } from "../../src/lib/http";
import { oneOf } from "../../src/lib/validate";

const STATUSES = ["OPEN", "PENDING", "RESOLVED", "CLOSED"] as const;

describe("oneOf", () => {
  it("returns the value when it is in the allowed set", () => {
    expect(oneOf("RESOLVED", STATUSES, "invalid_status")).toBe("RESOLVED");
  });

  it("throws with the given key when the value is not allowed", () => {
    try {
      oneOf("ARCHIVED", STATUSES, "invalid_status");
      throw new Error("should have thrown");
    } catch (err) {
      expect(err).toBeInstanceOf(ApiError);
      expect((err as ApiError).key).toBe("invalid_status");
    }
  });

  it("rejects non-string input", () => {
    expect(() => oneOf(3, STATUSES, "invalid_status")).toThrow(ApiError);
  });
});
