import { describe, expect, it } from "vitest";

import { ApiError } from "../../src/lib/http";
import { requireString } from "../../src/lib/validate";

describe("requireString", () => {
  it("returns the trimmed value when present", () => {
    expect(requireString("  hello  ")).toBe("hello");
  });

  it("throws an ApiError with the given key when empty", () => {
    try {
      requireString("   ", "subject_required");
      throw new Error("should have thrown");
    } catch (err) {
      expect(err).toBeInstanceOf(ApiError);
      expect((err as ApiError).status).toBe(400);
      expect((err as ApiError).key).toBe("subject_required");
    }
  });

  it("rejects non-string input", () => {
    expect(() => requireString(42, "message_required")).toThrow(ApiError);
  });
});
