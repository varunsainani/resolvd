import { describe, expect, it } from "vitest";

import { badRequest, forbidden, notFound, unauthorized } from "../../src/lib/http";

describe("http error factories", () => {
  it("badRequest defaults to 400 / invalid_input", () => {
    expect(badRequest()).toMatchObject({ status: 400, key: "invalid_input" });
    expect(badRequest("subject_required").key).toBe("subject_required");
  });

  it("unauthorized defaults to 401 / not_authenticated", () => {
    expect(unauthorized()).toMatchObject({ status: 401, key: "not_authenticated" });
  });

  it("forbidden defaults to 403 / forbidden", () => {
    expect(forbidden()).toMatchObject({ status: 403, key: "forbidden" });
  });

  it("notFound defaults to 404 / not_found", () => {
    expect(notFound()).toMatchObject({ status: 404, key: "not_found" });
    expect(notFound("ticket_not_found").key).toBe("ticket_not_found");
  });
});
