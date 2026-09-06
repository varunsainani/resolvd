import { describe, expect, it } from "vitest";

import { slaBreached } from "../../src/lib/analytics";

const now = new Date("2026-01-10T12:00:00Z");
const at = (iso: string) => new Date(iso);

describe("slaBreached", () => {
  it("is false when there is no deadline", () => {
    expect(slaBreached(null, null, now)).toBe(false);
    expect(slaBreached(null, at("2026-01-10T00:00:00Z"), now)).toBe(false);
  });

  it("flags a milestone completed after its deadline", () => {
    expect(slaBreached(at("2026-01-10T05:00:00Z"), at("2026-01-10T06:00:00Z"), now)).toBe(true);
  });

  it("does not flag a milestone completed on time", () => {
    expect(slaBreached(at("2026-01-10T06:00:00Z"), at("2026-01-10T05:00:00Z"), now)).toBe(false);
  });

  it("flags an unfinished milestone whose deadline has passed", () => {
    expect(slaBreached(at("2026-01-10T09:00:00Z"), null, now)).toBe(true);
  });

  it("does not flag an unfinished milestone still within its deadline", () => {
    expect(slaBreached(at("2026-01-11T00:00:00Z"), null, now)).toBe(false);
  });
});
