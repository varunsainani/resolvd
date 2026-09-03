import { describe, expect, it } from "vitest";

import { ApiError } from "../../src/lib/http";

describe("ApiError", () => {
  it("carries a status and an i18n key", () => {
    const err = new ApiError(409, "email_taken");
    expect(err.status).toBe(409);
    expect(err.key).toBe("email_taken");
  });

  it("is an Error whose message is the key", () => {
    const err = new ApiError(400, "invalid_input");
    expect(err).toBeInstanceOf(Error);
    expect(err.name).toBe("ApiError");
    expect(err.message).toBe("invalid_input");
  });
});
