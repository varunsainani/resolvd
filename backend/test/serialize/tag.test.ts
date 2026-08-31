import { describe, expect, it } from "vitest";

import { serializeTag } from "../../src/lib/serialize";

describe("serializeTag", () => {
  it("flattens a TicketTag join row into name and color", () => {
    expect(serializeTag({ tag: { name: "refund", color: "#ea580c" } })).toEqual({
      name: "refund",
      color: "#ea580c",
    });
  });
});
