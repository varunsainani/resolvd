import { describe, expect, it } from "vitest";

import { suggestReply } from "../../src/ai/suggest";
import { throwingProvider } from "../stub-provider";

describe("suggestReply with no grounding", () => {
  it("still produces a fallback reply and reports no used articles", async () => {
    const r = await suggestReply(
      {
        subject: "General question",
        customerName: "Dana",
        messages: [{ authorType: "CUSTOMER", body: "Hello" }],
        articles: [],
      },
      throwingProvider(),
    );
    expect(r.source).toBe("fallback");
    expect(r.usedArticles).toEqual([]);
    expect(r.reply).toContain("Hi Dana,");
  });
});
