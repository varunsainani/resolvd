import { describe, expect, it } from "vitest";

import { serializeAgentRef } from "../../src/lib/serialize";

describe("serializeAgentRef", () => {
  it("returns null for a missing agent", () => {
    expect(serializeAgentRef(null)).toBeNull();
    expect(serializeAgentRef(undefined)).toBeNull();
  });

  it("returns a compact reference for a present agent", () => {
    expect(serializeAgentRef({ id: "u1", name: "Sam", avatarColor: "#111" })).toEqual({
      id: "u1",
      name: "Sam",
      avatarColor: "#111",
    });
  });
});
