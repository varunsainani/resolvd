import type { Customer } from "@prisma/client";
import { describe, expect, it } from "vitest";

import { serializeTicketDetail, type TicketWithRelations } from "../../src/lib/serialize";
import { makeTicket } from "../fixtures";

const now = new Date("2026-09-03T12:00:00Z");

const customer: Customer = {
  id: "c1",
  name: "Dana Rivera",
  email: "dana@acme.test",
  company: "Acme",
  createdAt: new Date("2026-01-01T00:00:00Z"),
};

describe("serializeTicketDetail", () => {
  it("includes the summary and the ordered conversation thread", () => {
    const detail: TicketWithRelations = {
      ...makeTicket({ reference: 2001, subject: "Login loops", summary: "Customer cannot sign in." }),
      customer,
      messages: [
        {
          id: "m1",
          ticketId: "t1",
          authorType: "CUSTOMER",
          authorUserId: null,
          authorUser: null,
          body: "I keep getting logged out.",
          isInternal: false,
          createdAt: new Date("2026-09-03T10:00:00Z"),
        },
        {
          id: "m2",
          ticketId: "t1",
          authorType: "AGENT",
          authorUserId: "u1",
          authorUser: { id: "u1", name: "Sam Agent", avatarColor: "#0ea5a4" },
          body: "Let's take a look.",
          isInternal: false,
          createdAt: new Date("2026-09-03T10:05:00Z"),
        },
      ],
    };

    const out = serializeTicketDetail(detail, now);
    expect(out.reference).toBe(2001);
    expect(out.summary).toBe("Customer cannot sign in.");
    expect(out.messages).toHaveLength(2);
    expect(out.messages[1].author?.name).toBe("Sam Agent");
  });

  it("defaults to an empty thread when no messages are loaded", () => {
    const out = serializeTicketDetail({ ...makeTicket(), customer }, now);
    expect(out.messages).toEqual([]);
    expect(out.resolvedAt).toBeNull();
  });
});
