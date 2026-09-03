import { describe, expect, it } from "vitest";

import { buildPageMeta, parsePageParams } from "../../src/lib/pagination";

describe("buildPageMeta", () => {
  it("reports at least one page even when empty", () => {
    const meta = buildPageMeta(0, parsePageParams({ pageSize: "20" }));
    expect(meta.totalPages).toBe(1);
    expect(meta.total).toBe(0);
  });

  it("rounds the page count up", () => {
    const meta = buildPageMeta(45, parsePageParams({ pageSize: "20" }));
    expect(meta.totalPages).toBe(3);
    expect(meta).toMatchObject({ page: 1, pageSize: 20, total: 45 });
  });
});
