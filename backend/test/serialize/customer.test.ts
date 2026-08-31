import type { Customer } from "@prisma/client";
import { describe, expect, it } from "vitest";

import { serializeCustomer } from "../../src/lib/serialize";

const customer: Customer = {
  id: "c1",
  name: "Dana Ruiz",
  email: "dana@example.com",
  company: "Acme",
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
};

describe("serializeCustomer", () => {
  it("exposes the public customer fields", () => {
    expect(serializeCustomer(customer)).toMatchObject({
      id: "c1",
      name: "Dana Ruiz",
      email: "dana@example.com",
      company: "Acme",
    });
  });

  it("serializes createdAt as an ISO string", () => {
    expect(serializeCustomer(customer).createdAt).toBe("2026-01-01T00:00:00.000Z");
  });
});
