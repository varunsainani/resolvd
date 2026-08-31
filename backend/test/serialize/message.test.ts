import type { Message } from "@prisma/client";
import { describe, expect, it } from "vitest";

import { serializeMessage } from "../../src/lib/serialize";

const baseMessage: Message = {
  id: "m1",
  ticketId: "t1",
  authorType: "AGENT",
  authorUserId: "u1",
  body: "On it.",
  isInternal: false,
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
};

describe("serializeMessage", () => {
  it("embeds the resolved author reference", () => {
    const out = serializeMessage({
      ...baseMessage,
      authorUser: { id: "u1", name: "Sam", avatarColor: "#111" },
    });
    expect(out.author).toEqual({ id: "u1", name: "Sam", avatarColor: "#111" });
  });

  it("returns a null author when none is joined", () => {
    const out = serializeMessage({ ...baseMessage, authorType: "CUSTOMER", authorUser: null });
    expect(out.author).toBeNull();
    expect(out.createdAt).toBe("2026-01-01T00:00:00.000Z");
  });
});
