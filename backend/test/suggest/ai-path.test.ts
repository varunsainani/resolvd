import { describe, expect, it } from "vitest";

import { suggestReply } from "../../src/ai/suggest";
import { makeArticle } from "../fixtures";
import { stubProvider } from "../stub-provider";

describe("suggestReply AI path", () => {
  const article = makeArticle({ title: "Refund policy", keywords: "refund" });
  const provider = stubProvider(JSON.stringify({ reply: "Hi Dana,\n\nWe can refund that.\n\nBest,\nSam" }));

  it("returns the model reply and marks it as AI", async () => {
    const r = await suggestReply(
      {
        subject: "Refund",
        customerName: "Dana",
        agentName: "Sam",
        messages: [{ authorType: "CUSTOMER", body: "I want a refund" }],
        articles: [article],
      },
      provider,
    );
    expect(r.source).toBe("ai");
    expect(r.reply).toContain("We can refund that.");
  });

  it("reports which articles were used for grounding", async () => {
    const r = await suggestReply(
      {
        subject: "Refund",
        messages: [{ authorType: "CUSTOMER", body: "I want a refund" }],
        articles: [article],
      },
      provider,
    );
    expect(r.usedArticles).toEqual([{ id: article.id, title: "Refund policy" }]);
  });
});
