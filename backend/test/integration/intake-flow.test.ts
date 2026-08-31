import { describe, expect, it } from "vitest";

import { retrieveArticles } from "../../src/lib/kb";
import { suggestReply } from "../../src/ai/suggest";
import { triageTicket } from "../../src/ai/triage";
import { makeArticle } from "../fixtures";
import { stubProvider } from "../stub-provider";

// Exercises the full intake flow the way a route will: triage the incoming
// ticket, retrieve grounding articles, then draft a reply, all deterministic.
describe("intake flow", () => {
  const articles = [
    makeArticle({ title: "Resolving duplicate charges", keywords: "refund duplicate charge billing" }),
    makeArticle({ title: "Exporting your data", keywords: "export csv data" }),
  ];

  const subject = "Charged twice";
  const message = "I was billed twice for my subscription and need a refund.";

  it("triages, grounds, and drafts a reply end to end", async () => {
    const triageProvider = stubProvider(
      JSON.stringify({
        priority: "high",
        category: "billing",
        tags: ["refund", "double-charge"],
        sentiment: "negative",
        summary: "Customer was billed twice and wants a refund.",
      }),
    );
    const triage = await triageTicket({ subject, message }, triageProvider);
    expect(triage.source).toBe("ai");
    expect(triage.category).toBe("Billing");

    const grounding = retrieveArticles(articles, subject + " " + message, 2);
    expect(grounding[0].title).toBe("Resolving duplicate charges");

    const replyProvider = stubProvider(JSON.stringify({ reply: "Hi, we will refund the duplicate charge." }));
    const suggestion = await suggestReply(
      {
        subject,
        messages: [{ authorType: "CUSTOMER", body: message }],
        articles: grounding,
      },
      replyProvider,
    );
    expect(suggestion.source).toBe("ai");
    expect(suggestion.usedArticles.map((a) => a.title)).toContain("Resolving duplicate charges");
  });
});
