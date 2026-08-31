import { describe, expect, it } from "vitest";

import { triageTicket } from "../../src/ai/triage";
import { stubProvider } from "../stub-provider";

describe("triageTicket AI path", () => {
  const provider = stubProvider(
    JSON.stringify({
      priority: "urgent",
      category: "billing",
      tags: ["Refund", "double charge", "vip"],
      sentiment: "negative",
      summary: "  Customer was   billed twice.  ",
    }),
  );

  it("marks the result as coming from the model", async () => {
    const r = await triageTicket({ subject: "Billed twice", message: "help" }, provider);
    expect(r.source).toBe("ai");
  });

  it("uppercases and validates the priority and sentiment", async () => {
    const r = await triageTicket({ subject: "Billed twice", message: "help" }, provider);
    expect(r.priority).toBe("URGENT");
    expect(r.sentiment).toBe("NEGATIVE");
  });

  it("normalizes the category against the known list", async () => {
    const r = await triageTicket({ subject: "Billed twice", message: "help" }, provider);
    expect(r.category).toBe("Billing");
  });

  it("slugifies tags and caps them at three", async () => {
    const r = await triageTicket({ subject: "Billed twice", message: "help" }, provider);
    expect(r.tags).toEqual(["refund", "double-charge", "vip"]);
  });

  it("normalizes whitespace in the summary", async () => {
    const r = await triageTicket({ subject: "Billed twice", message: "help" }, provider);
    expect(r.summary).toBe("Customer was billed twice.");
  });
});
