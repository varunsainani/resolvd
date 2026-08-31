import { describe, expect, it } from "vitest";

import { triageTicket } from "../../src/ai/triage";
import { stubProvider, throwingProvider } from "../stub-provider";

describe("triageTicket fallback path", () => {
  it("falls back to heuristics when the provider throws", async () => {
    const r = await triageTicket(
      { subject: "Refund please", message: "I was charged twice, this is urgent" },
      throwingProvider(),
    );
    expect(r.source).toBe("fallback");
    expect(r.priority).toBe("URGENT");
    expect(r.category).toBe("Billing");
  });

  it("falls back when the provider returns empty output", async () => {
    const r = await triageTicket(
      { subject: "Login broken", message: "cannot log in, keeps failing" },
      stubProvider(""),
    );
    expect(r.source).toBe("fallback");
    expect(r.summary.length).toBeGreaterThan(0);
  });

  it("still returns a full result when the model output is malformed", async () => {
    const r = await triageTicket(
      { subject: "API down", message: "webhook stopped firing" },
      stubProvider("this is not json"),
    );
    expect(r.source).toBe("fallback");
    expect(r.category).toBe("Integration");
  });
});
