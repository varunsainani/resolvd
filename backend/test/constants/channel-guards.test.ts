import { describe, expect, it } from "vitest";

import { isChannel } from "../../src/lib/constants";

describe("isChannel", () => {
  it("accepts known channels", () => {
    expect(isChannel("EMAIL")).toBe(true);
    expect(isChannel("WEB")).toBe(true);
  });

  it("rejects unknown values", () => {
    expect(isChannel("SMS")).toBe(false);
    expect(isChannel(undefined)).toBe(false);
  });
});
