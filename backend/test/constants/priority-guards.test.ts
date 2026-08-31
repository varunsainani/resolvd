import { describe, expect, it } from "vitest";

import { isTicketPriority } from "../../src/lib/constants";

describe("isTicketPriority", () => {
  it("accepts known priorities", () => {
    expect(isTicketPriority("URGENT")).toBe(true);
    expect(isTicketPriority("LOW")).toBe(true);
  });

  it("rejects unknown values", () => {
    expect(isTicketPriority("CRITICAL")).toBe(false);
    expect(isTicketPriority(null)).toBe(false);
  });
});
