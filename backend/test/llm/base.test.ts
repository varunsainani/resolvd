import { describe, expect, it } from "vitest";

import { BACKOFFS, RETRY_STATUSES, sleep } from "../../src/llm/base";

describe("provider retry config", () => {
  it("retries on rate-limit and upstream errors", () => {
    expect(RETRY_STATUSES.has(429)).toBe(true);
    expect(RETRY_STATUSES.has(503)).toBe(true);
  });

  it("does not retry on a 400 bad request", () => {
    expect(RETRY_STATUSES.has(400)).toBe(false);
  });

  it("defines an increasing backoff schedule", () => {
    expect(BACKOFFS.length).toBeGreaterThan(0);
    expect(BACKOFFS[BACKOFFS.length - 1]).toBeGreaterThan(BACKOFFS[0]);
  });

  it("sleep resolves after the given delay", async () => {
    await expect(sleep(1)).resolves.toBeUndefined();
  });
});
