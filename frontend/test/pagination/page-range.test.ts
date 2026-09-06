import { describe, expect, it } from "vitest";

import { pageRange } from "@/lib/pagination";

describe("pageRange", () => {
  it("returns empty for no pages and single for one", () => {
    expect(pageRange(1, 0)).toEqual([]);
    expect(pageRange(1, 1)).toEqual([1]);
  });

  it("shows every page when they all fit", () => {
    expect(pageRange(3, 5)).toEqual([1, 2, 3, 4, 5]);
  });

  it("inserts a trailing ellipsis near the start", () => {
    expect(pageRange(1, 10)).toEqual([1, 2, "ellipsis", 10]);
  });

  it("inserts ellipses on both sides in the middle", () => {
    expect(pageRange(5, 10)).toEqual([1, "ellipsis", 4, 5, 6, "ellipsis", 10]);
  });

  it("inserts a leading ellipsis near the end", () => {
    expect(pageRange(10, 10)).toEqual([1, "ellipsis", 9, 10]);
  });
});
