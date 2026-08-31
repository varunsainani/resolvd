import { describe, expect, it } from "vitest";

import { computeSlaDueDates } from "../../src/lib/sla";

const from = new Date("2026-01-01T00:00:00.000Z");

describe("computeSlaDueDates", () => {
  it("uses the 30 and 240 minute targets for URGENT", () => {
    const { firstDue, resolveDue } = computeSlaDueDates("URGENT", from);
    expect(firstDue.toISOString()).toBe("2026-01-01T00:30:00.000Z");
    expect(resolveDue.toISOString()).toBe("2026-01-01T04:00:00.000Z");
  });

  it("uses the wider targets for LOW", () => {
    const { firstDue, resolveDue } = computeSlaDueDates("LOW", from);
    expect(firstDue.toISOString()).toBe("2026-01-01T08:00:00.000Z");
    expect(resolveDue.toISOString()).toBe("2026-01-03T00:00:00.000Z");
  });
});
