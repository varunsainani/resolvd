import { describe, expect, it } from "vitest";

import { triageTicket } from "../../src/ai/triage";
import { stubProvider } from "../stub-provider";

describe("triageTicket partial normalization", () => {
  it("keeps valid fields but heuristically fills an invalid priority", async () => {
    const provider = stubProvider(
      JSON.stringify({
        priority: "SUPER",
        category: "billing",
        tags: ["refund"],
        sentiment: "negative",
        summary: "Duplicate charge.",
      }),
    );
    const r = await triageTicket(
      { subject: "Charged twice", message: "I was charged twice, this is urgent" },
      provider,
    );
    // Model output was otherwise valid, so the result is still AI-sourced.
    expect(r.source).toBe("ai");
    expect(r.category).toBe("Billing");
    // "SUPER" is not a real priority, so it comes from the heuristic instead.
    expect(r.priority).toBe("URGENT");
  });
});
