import { describe, expect, it } from "vitest";

import { INBOX_DEFAULTS, hasActiveFilters, inboxToQuery } from "@/lib/inbox-params";

describe("inboxToQuery", () => {
  it("omits defaults entirely", () => {
    expect(inboxToQuery(INBOX_DEFAULTS)).toEqual({});
  });

  it("includes only the filters that are set", () => {
    expect(inboxToQuery({ ...INBOX_DEFAULTS, status: "OPEN", q: "refund" })).toEqual({
      status: "OPEN",
      q: "refund",
    });
  });

  it("omits sort when newest but keeps other sorts", () => {
    expect(inboxToQuery({ ...INBOX_DEFAULTS, sort: "newest" }).sort).toBeUndefined();
    expect(inboxToQuery({ ...INBOX_DEFAULTS, sort: "priority" }).sort).toBe("priority");
  });

  it("omits page 1 but keeps higher pages as strings", () => {
    expect(inboxToQuery({ ...INBOX_DEFAULTS, page: 1 }).page).toBeUndefined();
    expect(inboxToQuery({ ...INBOX_DEFAULTS, page: 4 }).page).toBe("4");
  });
});

describe("hasActiveFilters", () => {
  it("is false for defaults", () => {
    expect(hasActiveFilters(INBOX_DEFAULTS)).toBe(false);
  });

  it("ignores sort and page", () => {
    expect(hasActiveFilters({ ...INBOX_DEFAULTS, sort: "oldest", page: 5 })).toBe(false);
  });

  it("is true when a filter or search is set", () => {
    expect(hasActiveFilters({ ...INBOX_DEFAULTS, status: "OPEN" })).toBe(true);
    expect(hasActiveFilters({ ...INBOX_DEFAULTS, q: "x" })).toBe(true);
  });
});
