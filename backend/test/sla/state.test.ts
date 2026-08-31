import { describe, expect, it } from "vitest";

import { slaState } from "../../src/lib/sla";

const now = new Date("2026-01-01T12:00:00.000Z");

describe("slaState", () => {
  it("is met when the milestone is already done", () => {
    expect(slaState(new Date("2026-01-01T10:00:00Z"), now, true)).toBe("met");
  });

  it("is none when there is no due date", () => {
    expect(slaState(null, now, false)).toBe("none");
  });

  it("is breached when the deadline has passed", () => {
    expect(slaState(new Date("2026-01-01T11:00:00Z"), now, false)).toBe("breached");
  });

  it("is due-soon within the hour", () => {
    expect(slaState(new Date("2026-01-01T12:30:00Z"), now, false)).toBe("due-soon");
  });

  it("is ok when comfortably ahead", () => {
    expect(slaState(new Date("2026-01-01T15:00:00Z"), now, false)).toBe("ok");
  });
});
