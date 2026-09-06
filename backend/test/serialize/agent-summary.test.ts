import type { User } from "@prisma/client";
import { describe, expect, it } from "vitest";

import { serializeAgentSummary } from "../../src/lib/serialize";

const user: User = {
  id: "u1",
  name: "Sam Agent",
  email: "sam@resolvd.app",
  passwordHash: "$2a$10$supersecrethash",
  role: "agent",
  locale: "en",
  theme: "light",
  avatarColor: "#0ea5a4",
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
};

describe("serializeAgentSummary", () => {
  it("includes assignment counts and createdAt", () => {
    const out = serializeAgentSummary({ ...user, openAssigned: 3, totalAssigned: 12 });
    expect(out).toMatchObject({
      id: "u1",
      role: "agent",
      openAssigned: 3,
      totalAssigned: 12,
      createdAt: "2026-01-01T00:00:00.000Z",
    });
  });

  it("defaults counts to 0 and never leaks the password hash", () => {
    const out = serializeAgentSummary(user) as Record<string, unknown>;
    expect(out.openAssigned).toBe(0);
    expect(out.totalAssigned).toBe(0);
    expect(out.passwordHash).toBeUndefined();
  });
});
