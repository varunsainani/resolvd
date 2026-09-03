import { describe, expect, it } from "vitest";

import { parsePageParams } from "../../src/lib/pagination";

describe("parsePageParams", () => {
  it("defaults to page 1, pageSize 20", () => {
    expect(parsePageParams({})).toEqual({ page: 1, pageSize: 20, skip: 0, take: 20 });
  });

  it("computes skip from page and pageSize", () => {
    expect(parsePageParams({ page: "3", pageSize: "10" })).toEqual({
      page: 3,
      pageSize: 10,
      skip: 20,
      take: 10,
    });
  });

  it("clamps pageSize to the 100 maximum", () => {
    expect(parsePageParams({ pageSize: "500" }).pageSize).toBe(100);
  });

  it("falls back to defaults for invalid or negative values", () => {
    expect(parsePageParams({ page: "-2", pageSize: "abc" })).toMatchObject({
      page: 1,
      pageSize: 20,
    });
  });

  it("reads the first entry of a repeated query param", () => {
    expect(parsePageParams({ page: ["2", "9"] }).page).toBe(2);
  });
});
