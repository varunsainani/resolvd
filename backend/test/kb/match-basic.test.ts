import { describe, expect, it } from "vitest";

import { retrieveArticles } from "../../src/lib/kb";
import { makeArticle } from "../fixtures";

describe("retrieveArticles basic matching", () => {
  const articles = [
    makeArticle({ title: "Resolving duplicate charges", keywords: "refund duplicate charge billing" }),
    makeArticle({ title: "Exporting your data", keywords: "export csv data" }),
  ];

  it("returns articles whose keywords overlap the query", () => {
    const out = retrieveArticles(articles, "I was charged twice and want a refund");
    expect(out.map((a) => a.title)).toContain("Resolving duplicate charges");
  });

  it("omits articles with no keyword overlap", () => {
    const out = retrieveArticles(articles, "I was charged twice and want a refund");
    expect(out.map((a) => a.title)).not.toContain("Exporting your data");
  });
});
