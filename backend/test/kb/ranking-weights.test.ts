import { describe, expect, it } from "vitest";

import { retrieveArticles } from "../../src/lib/kb";
import { makeArticle } from "../fixtures";

describe("retrieveArticles ranking", () => {
  it("ranks a keyword-field match above a body-only match", () => {
    const keywordHit = makeArticle({ title: "Billing help", keywords: "refund" });
    const bodyHit = makeArticle({
      title: "General notes",
      body: "sometimes a refund is mentioned deep in the body text here",
    });
    const out = retrieveArticles([bodyHit, keywordHit], "refund please", 2);
    expect(out[0].title).toBe("Billing help");
  });

  it("ranks a title match above a body-only match", () => {
    const titleHit = makeArticle({ title: "Refund policy" });
    const bodyHit = makeArticle({ title: "Notes", body: "a refund can be discussed" });
    const out = retrieveArticles([bodyHit, titleHit], "refund", 2);
    expect(out[0].title).toBe("Refund policy");
  });
});
