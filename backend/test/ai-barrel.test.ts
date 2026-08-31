import { describe, expect, it } from "vitest";

import * as ai from "../src/ai";

describe("AI layer public surface", () => {
  it("exports the triage, suggest, and retrieval entry points", () => {
    expect(typeof ai.triageTicket).toBe("function");
    expect(typeof ai.suggestReply).toBe("function");
    expect(typeof ai.retrieveArticles).toBe("function");
  });
});
