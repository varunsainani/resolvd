import { describe, expect, it } from "vitest";

import { INBOX_DEFAULTS, parseInboxParams } from "@/lib/inbox-params";

const parse = (qs: string) => parseInboxParams(new URLSearchParams(qs));

describe("parseInboxParams", () => {
  it("returns defaults for empty params", () => {
    expect(parse("")).toEqual(INBOX_DEFAULTS);
  });

  it("keeps valid enum and sort values", () => {
    const f = parse("status=OPEN&priority=URGENT&channel=EMAIL&sort=oldest");
    expect(f.status).toBe("OPEN");
    expect(f.priority).toBe("URGENT");
    expect(f.channel).toBe("EMAIL");
    expect(f.sort).toBe("oldest");
  });

  it("drops unknown enum values back to empty", () => {
    const f = parse("status=NONSENSE&channel=fax");
    expect(f.status).toBe("");
    expect(f.channel).toBe("");
  });

  it("falls back to newest for an unknown sort", () => {
    expect(parse("sort=whatever").sort).toBe("newest");
  });

  it("clamps page to at least 1 and floors it", () => {
    expect(parse("page=0").page).toBe(1);
    expect(parse("page=-3").page).toBe(1);
    expect(parse("page=abc").page).toBe(1);
    expect(parse("page=3").page).toBe(3);
  });

  it("trims q and assignee", () => {
    const f = parse("q=%20hello%20&assignee=%20me%20");
    expect(f.q).toBe("hello");
    expect(f.assignee).toBe("me");
  });
});
