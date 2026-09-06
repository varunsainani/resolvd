import { describe, expect, it } from "vitest";

import { ApiError } from "@/lib/api";
import { errorMessage } from "@/lib/errors";

describe("errorMessage", () => {
  it("uses the ApiError's localized detail", () => {
    expect(errorMessage(new ApiError(401, "Invalid email or password."), "fallback")).toBe(
      "Invalid email or password.",
    );
  });

  it("falls back for non-ApiError values", () => {
    expect(errorMessage(new TypeError("Failed to fetch"), "fallback")).toBe("fallback");
    expect(errorMessage("boom", "fallback")).toBe("fallback");
    expect(errorMessage(undefined, "fallback")).toBe("fallback");
  });
});
