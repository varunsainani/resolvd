import { describe, expect, it } from "vitest";

import { triageTicket } from "../../src/ai/triage";
import { stubProvider } from "../stub-provider";

describe("triageTicket tag normalization", () => {
  it("dedupes, slugifies, and drops overly long tags", async () => {
    const provider = stubProvider(
      JSON.stringify({
        priority: "normal",
        category: "general",
        tags: ["Refund", "refund", "this-tag-is-way-too-long-to-keep-around", "How To"],
        sentiment: "neutral",
        summary: "A question.",
      }),
    );
    const r = await triageTicket({ subject: "Q", message: "just a question" }, provider);
    expect(r.tags).toEqual(["refund", "how-to"]);
  });
});
