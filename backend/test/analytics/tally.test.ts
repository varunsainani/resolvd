import { describe, expect, it } from "vitest";

import { tally, tallyToArray } from "../../src/lib/analytics";

describe("tally", () => {
  it("counts each distinct value", () => {
    expect(tally(["OPEN", "OPEN", "CLOSED"])).toEqual({ OPEN: 2, CLOSED: 1 });
  });

  it("is empty for no values", () => {
    expect(tally([])).toEqual({});
  });
});

describe("tallyToArray", () => {
  const keys = ["OPEN", "PENDING", "RESOLVED", "CLOSED"] as const;

  it("zero-fills every key and keeps the given order", () => {
    const out = tallyToArray({ OPEN: 3, CLOSED: 1 }, keys);
    expect(out).toEqual([
      { key: "OPEN", count: 3 },
      { key: "PENDING", count: 0 },
      { key: "RESOLVED", count: 0 },
      { key: "CLOSED", count: 1 },
    ]);
  });

  it("drops counts for keys outside the fixed set", () => {
    const out = tallyToArray({ OPEN: 2, MYSTERY: 9 }, keys);
    expect(out.find((e) => e.key === "MYSTERY")).toBeUndefined();
    expect(out.find((e) => e.key === "OPEN")?.count).toBe(2);
  });
});
