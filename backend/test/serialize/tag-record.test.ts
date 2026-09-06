import { describe, expect, it } from "vitest";

import { serializeTagRecord } from "../../src/lib/serialize";

describe("serializeTagRecord", () => {
  it("exposes id, name, color, and usage count", () => {
    expect(
      serializeTagRecord({ id: "t1", name: "urgent", color: "#dc2626", _count: { tickets: 7 } }),
    ).toEqual({ id: "t1", name: "urgent", color: "#dc2626", count: 7 });
  });

  it("defaults the count to 0 when no aggregate is present", () => {
    expect(serializeTagRecord({ id: "t2", name: "vip", color: "#9333ea" }).count).toBe(0);
  });
});
