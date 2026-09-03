import type { Customer } from "@prisma/client";
import { describe, expect, it } from "vitest";

import { serializeTicketRow, type TicketWithRelations } from "../../src/lib/serialize";
import { makeTicket } from "../fixtures";

const now = new Date("2026-09-03T12:00:00Z");

const customer: Customer = {
  id: "c1",
  name: "Dana Rivera",
  email: "dana@acme.test",
  company: "Acme",
  createdAt: new Date("2026-01-01T00:00:00Z"),
};

describe("serializeTicketRow", () => {
  it("projects the fields the inbox list renders", () => {
    const row: TicketWithRelations = {
      ...makeTicket({ reference: 1042, subject: "Refund please", priority: "HIGH" }),
      customer,
      assignee: { id: "u1", name: "Sam Agent", avatarColor: "#0ea5a4" },
      tags: [{ tag: { name: "refund", color: "#ea580c" } }],
      _count: { messages: 3 },
    };

    const out = serializeTicketRow(row, now);
    expect(out).toMatchObject({
      reference: 1042,
      subject: "Refund please",
      priority: "HIGH",
      messageCount: 3,
    });
    expect(out.customer?.email).toBe("dana@acme.test");
    expect(out.assignee?.name).toBe("Sam Agent");
    expect(out.tags).toEqual([{ name: "refund", color: "#ea580c" }]);
    expect(out.sla.firstResponse).toBeDefined();
  });

  it("handles a missing assignee and no tags", () => {
    const out = serializeTicketRow({ ...makeTicket(), customer }, now);
    expect(out.assignee).toBeNull();
    expect(out.tags).toEqual([]);
    expect(out.messageCount).toBe(0);
  });
});
