import type { Customer } from "@prisma/client";
import { describe, expect, it } from "vitest";

import { serializeCustomerSummary } from "../../src/lib/serialize";

const base: Customer = {
  id: "c1",
  name: "Dana Ruiz",
  email: "dana@example.com",
  company: "Acme",
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
};

describe("serializeCustomerSummary", () => {
  it("adds the aggregated ticket count", () => {
    const out = serializeCustomerSummary({ ...base, _count: { tickets: 4 } });
    expect(out).toMatchObject({ id: "c1", name: "Dana Ruiz", ticketCount: 4 });
  });

  it("defaults the ticket count to 0 when no aggregate is present", () => {
    expect(serializeCustomerSummary(base).ticketCount).toBe(0);
  });
});
