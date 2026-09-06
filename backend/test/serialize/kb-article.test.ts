import { describe, expect, it } from "vitest";

import { serializeKbArticle } from "../../src/lib/serialize";
import { makeArticle } from "../fixtures";

describe("serializeKbArticle", () => {
  const article = makeArticle({
    id: "kb1",
    title: "Fixing double charges",
    body: "Steps to refund a duplicate charge.",
    category: "Billing",
    keywords: "refund charge billing",
  });

  it("exposes the article fields", () => {
    expect(serializeKbArticle(article)).toMatchObject({
      id: "kb1",
      title: "Fixing double charges",
      category: "Billing",
      keywords: "refund charge billing",
    });
  });

  it("serializes timestamps as ISO strings", () => {
    const out = serializeKbArticle(article);
    expect(out.createdAt).toBe("2026-01-01T00:00:00.000Z");
    expect(out.updatedAt).toBe("2026-01-01T00:00:00.000Z");
  });
});
