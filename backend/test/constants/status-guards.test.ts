import { describe, expect, it } from "vitest";

import { isTicketStatus } from "../../src/lib/constants";

describe("isTicketStatus", () => {
  it("accepts known statuses", () => {
    expect(isTicketStatus("OPEN")).toBe(true);
    expect(isTicketStatus("RESOLVED")).toBe(true);
  });

  it("rejects unknown or lowercased values", () => {
    expect(isTicketStatus("open")).toBe(false);
    expect(isTicketStatus("ARCHIVED")).toBe(false);
    expect(isTicketStatus(42)).toBe(false);
  });
});
