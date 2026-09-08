import { describe, expect, it } from "vitest";

import { INBOX_SORTS } from "@/lib/inbox-params";

// The inbox sort tokens must stay aligned with what the backend `orderFor`
// switch understands: "oldest", "updated", "priority", and the default
// "newest". If a token drifts, sorting silently falls back to newest.
describe("INBOX_SORTS", () => {
  it("matches the backend-accepted sort tokens exactly", () => {
    expect([...INBOX_SORTS].sort()).toEqual(["newest", "oldest", "priority", "updated"]);
  });

  it("leads with newest as the default", () => {
    expect(INBOX_SORTS[0]).toBe("newest");
  });
});
