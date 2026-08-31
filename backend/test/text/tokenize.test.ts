import { describe, expect, it } from "vitest";

import { tokenize } from "../../src/lib/text";

describe("tokenize", () => {
  it("lowercases and strips punctuation", () => {
    expect(tokenize("Refund, PLEASE!")).toEqual(["refund"]);
  });

  it("drops stopwords and very short tokens", () => {
    expect(tokenize("I have a big problem")).toEqual(["big", "problem"]);
  });

  it("keeps alphanumeric terms like 500 and 2fa", () => {
    expect(tokenize("error 500 on 2fa login")).toEqual(["error", "500", "2fa", "login"]);
  });

  it("returns an empty array for empty input", () => {
    expect(tokenize("")).toEqual([]);
  });
});
