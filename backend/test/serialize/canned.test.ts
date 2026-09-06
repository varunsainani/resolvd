import type { CannedResponse } from "@prisma/client";
import { describe, expect, it } from "vitest";

import { serializeCannedResponse } from "../../src/lib/serialize";

const canned: CannedResponse = {
  id: "cr1",
  title: "Password reset steps",
  body: "Head to Settings > Security and click Reset password.",
  category: "Account",
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
};

describe("serializeCannedResponse", () => {
  it("exposes the macro fields", () => {
    expect(serializeCannedResponse(canned)).toMatchObject({
      id: "cr1",
      title: "Password reset steps",
      category: "Account",
    });
  });

  it("serializes createdAt as an ISO string", () => {
    expect(serializeCannedResponse(canned).createdAt).toBe("2026-01-01T00:00:00.000Z");
  });
});
