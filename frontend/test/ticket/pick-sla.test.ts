import { describe, expect, it } from "vitest";

import { pickSla } from "@/lib/ticket-format";
import type { SlaBlock, SlaStateValue } from "@/types";

const milestone = (state: SlaStateValue) => ({ state, dueAt: null, minutesRemaining: null });
const block = (firstResponse: SlaStateValue, resolution: SlaStateValue): SlaBlock => ({
  firstResponse: milestone(firstResponse),
  resolution: milestone(resolution),
});

describe("pickSla", () => {
  it("surfaces the more urgent milestone", () => {
    expect(pickSla(block("breached", "ok")).state).toBe("breached");
    expect(pickSla(block("met", "due-soon")).state).toBe("due-soon");
  });

  it("favors resolution on a severity tie", () => {
    const b = block("ok", "ok");
    expect(pickSla(b)).toBe(b.resolution);
  });

  it("returns resolution when neither clock is running", () => {
    const b = block("none", "none");
    expect(pickSla(b)).toBe(b.resolution);
  });
});
