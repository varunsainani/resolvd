import { describe, expect, it } from "vitest";

import { retrieveArticles } from "../../src/lib/kb";
import { makeArticle } from "../fixtures";

describe("retrieveArticles limit and empty cases", () => {
  const articles = [
    makeArticle({ title: "Refund one", keywords: "refund" }),
    makeArticle({ title: "Refund two", keywords: "refund" }),
    makeArticle({ title: "Refund three", keywords: "refund" }),
  ];

  it("caps the result count at the requested limit", () => {
    expect(retrieveArticles(articles, "refund", 2)).toHaveLength(2);
  });

  it("returns nothing for an empty query", () => {
    expect(retrieveArticles(articles, "")).toEqual([]);
  });

  it("returns nothing when there are no articles", () => {
    expect(retrieveArticles([], "refund")).toEqual([]);
  });
});
