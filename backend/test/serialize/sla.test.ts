import { describe, expect, it } from "vitest";

import { serializeSla } from "../../src/lib/serialize";
import { makeTicket } from "../fixtures";

const now = new Date("2026-09-03T12:00:00Z");

describe("serializeSla", () => {
  it("marks the first response met once it was sent", () => {
    const t = makeTicket({
      firstResponseAt: new Date("2026-09-03T11:30:00Z"),
      slaFirstDueAt: new Date("2026-09-03T11:00:00Z"),
    });
    expect(serializeSla(t, now).firstResponse.state).toBe("met");
  });

  it("reports none when there is no deadline", () => {
    expect(serializeSla(makeTicket(), now).firstResponse.state).toBe("none");
  });

  it("breaches an overdue resolution that is still open", () => {
    const t = makeTicket({
      status: "OPEN",
      slaResolveDueAt: new Date("2026-09-03T11:00:00Z"),
    });
    const sla = serializeSla(t, now);
    expect(sla.resolution.state).toBe("breached");
    expect(sla.resolution.minutesRemaining).toBe(-60);
  });

  it("counts a RESOLVED ticket as having met resolution", () => {
    const t = makeTicket({
      status: "RESOLVED",
      slaResolveDueAt: new Date("2026-09-03T11:00:00Z"),
    });
    expect(serializeSla(t, now).resolution.state).toBe("met");
  });
});
