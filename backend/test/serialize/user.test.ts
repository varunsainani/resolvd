import type { User } from "@prisma/client";
import { describe, expect, it } from "vitest";

import { serializeUser } from "../../src/lib/serialize";

const user: User = {
  id: "u1",
  name: "Sam Agent",
  email: "sam@resolvd.app",
  passwordHash: "$2a$10$supersecrethash",
  role: "agent",
  locale: "en",
  theme: "light",
  avatarColor: "#0ea5a4",
  createdAt: new Date("2026-01-01T00:00:00Z"),
};

describe("serializeUser", () => {
  it("never leaks the password hash", () => {
    const out = serializeUser(user) as Record<string, unknown>;
    expect(out.passwordHash).toBeUndefined();
    expect(JSON.stringify(out)).not.toContain("supersecret");
  });

  it("exposes the public profile fields", () => {
    expect(serializeUser(user)).toMatchObject({
      id: "u1",
      name: "Sam Agent",
      email: "sam@resolvd.app",
      role: "agent",
    });
  });
});
