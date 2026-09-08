import { describe, expect, it } from "vitest";

import { isInbound, isTicketClosed, referenceLabel } from "@/lib/ticket-format";

describe("referenceLabel", () => {
  it("prefixes the number with a hash", () => {
    expect(referenceLabel(1042)).toBe("#1042");
  });
});

describe("isTicketClosed", () => {
  it("is true for resolved and closed", () => {
    expect(isTicketClosed("RESOLVED")).toBe(true);
    expect(isTicketClosed("CLOSED")).toBe(true);
  });

  it("is false for open and pending", () => {
    expect(isTicketClosed("OPEN")).toBe(false);
    expect(isTicketClosed("PENDING")).toBe(false);
  });
});

describe("isInbound", () => {
  it("is true only for customer messages", () => {
    expect(isInbound({ authorType: "CUSTOMER" })).toBe(true);
    expect(isInbound({ authorType: "AGENT" })).toBe(false);
    expect(isInbound({ authorType: "SYSTEM" })).toBe(false);
  });
});
