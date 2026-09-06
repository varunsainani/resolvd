import { describe, expect, it } from "vitest";

import { serializePublicTicket } from "../../src/lib/serialize";
import { makeTicket } from "../fixtures";

describe("serializePublicTicket", () => {
  const ticket = makeTicket({
    reference: 1042,
    subject: "Double charged this month",
    status: "OPEN",
    priority: "URGENT",
    category: "Billing",
    sentiment: "NEGATIVE",
    summary: "Customer was billed twice.",
    aiTriaged: true,
    assigneeId: "agent-1",
  });

  it("exposes only the customer-safe fields", () => {
    const out = serializePublicTicket(ticket) as Record<string, unknown>;
    expect(out).toMatchObject({
      reference: 1042,
      subject: "Double charged this month",
      status: "OPEN",
      priority: "URGENT",
      category: "Billing",
      sentiment: "NEGATIVE",
      aiTriaged: true,
    });
  });

  it("never leaks assignee or internal fields", () => {
    const out = serializePublicTicket(ticket) as Record<string, unknown>;
    expect(out.assigneeId).toBeUndefined();
    expect(out.assignee).toBeUndefined();
    expect(out.customerId).toBeUndefined();
    expect(out.slaFirstDueAt).toBeUndefined();
  });
});
