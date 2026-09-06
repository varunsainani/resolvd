import { describe, expect, it } from "vitest";

import { percentage } from "../../src/lib/analytics";

describe("percentage", () => {
  it("rounds part/total to a whole percent", () => {
    expect(percentage(1, 3)).toBe(33);
    expect(percentage(2, 3)).toBe(67);
    expect(percentage(50, 200)).toBe(25);
  });

  it("treats a zero or negative total as 0%", () => {
    expect(percentage(5, 0)).toBe(0);
    expect(percentage(5, -10)).toBe(0);
  });

  it("returns 100 when the whole is the part", () => {
    expect(percentage(7, 7)).toBe(100);
  });
});
