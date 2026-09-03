import { describe, expect, it } from "vitest";

import { ApiError } from "../../src/lib/http";
import { requireEmail } from "../../src/lib/validate";

describe("requireEmail", () => {
  it("lowercases and trims a valid address", () => {
    expect(requireEmail("  Sam@Resolvd.APP ")).toBe("sam@resolvd.app");
  });

  it("rejects an address with no domain dot", () => {
    expect(() => requireEmail("sam@localhost")).toThrow(ApiError);
  });

  it("rejects a value missing the @ sign", () => {
    try {
      requireEmail("not-an-email");
      throw new Error("should have thrown");
    } catch (err) {
      expect((err as ApiError).key).toBe("email_required");
    }
  });
});
