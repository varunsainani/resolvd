import { describe, expect, it } from "vitest";

import { buildTicketWhere } from "../../src/lib/ticket-filter";

describe("buildTicketWhere", () => {
  it("is empty for no filters", () => {
    expect(buildTicketWhere({})).toEqual({});
  });

  it("keeps only recognised enum filters", () => {
    const where = buildTicketWhere({
      status: "OPEN",
      priority: "URGENT",
      channel: "EMAIL",
      bogus: "x",
    });
    expect(where).toMatchObject({ status: "OPEN", priority: "URGENT", channel: "EMAIL" });
  });

  it("drops invalid enum values", () => {
    const where = buildTicketWhere({ status: "SLEEPING", priority: "MEGA" });
    expect(where.status).toBeUndefined();
    expect(where.priority).toBeUndefined();
  });

  it("resolves assignee=me to the caller id", () => {
    expect(buildTicketWhere({ assignee: "me" }, "u1").assigneeId).toBe("u1");
  });

  it("ignores assignee=me without a caller id", () => {
    expect(buildTicketWhere({ assignee: "me" }).assigneeId).toBeUndefined();
  });

  it("maps assignee=unassigned to null", () => {
    expect(buildTicketWhere({ assignee: "unassigned" }).assigneeId).toBeNull();
  });

  it("treats any other assignee value as an explicit id", () => {
    expect(buildTicketWhere({ assignee: "agent-9" }).assigneeId).toBe("agent-9");
  });

  it("searches subject, customer name, and email", () => {
    const where = buildTicketWhere({ q: " dana " });
    expect(where.OR).toEqual([
      { subject: { contains: "dana", mode: "insensitive" } },
      { customer: { name: { contains: "dana", mode: "insensitive" } } },
      { customer: { email: { contains: "dana", mode: "insensitive" } } },
    ]);
  });

  it("adds a reference match when the search is a positive integer", () => {
    const where = buildTicketWhere({ q: "#1042" });
    expect(where.OR).toContainEqual({ reference: 1042 });
  });

  it("does not add a reference match for non-numeric search", () => {
    const where = buildTicketWhere({ q: "hello" });
    expect((where.OR as unknown[])?.some((c) => "reference" in (c as object))).toBe(false);
  });
});
