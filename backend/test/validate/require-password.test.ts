import { describe, expect, it } from "vitest";

import { ApiError } from "../../src/lib/http";
import { requirePassword } from "../../src/lib/validate";

describe("requirePassword", () => {
  it("accepts a password of at least 8 characters unchanged", () => {
    expect(requirePassword("demo1234")).toBe("demo1234");
  });

  it("preserves surrounding whitespace (never trims)", () => {
    expect(requirePassword("  spaced  ")).toBe("  spaced  ");
  });

  it("rejects a short password with password_too_short", () => {
    try {
      requirePassword("short");
      throw new Error("should have thrown");
    } catch (err) {
      expect(err).toBeInstanceOf(ApiError);
      expect((err as ApiError).key).toBe("password_too_short");
    }
  });
});
