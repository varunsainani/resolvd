import { describe, expect, it } from "vitest";

import { cn } from "@/lib/cn";

describe("cn", () => {
  it("lets a later Tailwind utility override an earlier one", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
    expect(cn("text-sm", "text-lg")).toBe("text-lg");
  });

  it("drops falsy conditional classes", () => {
    expect(cn("a", false && "b", null, undefined, "c")).toBe("a c");
  });

  it("keeps unrelated utilities", () => {
    expect(cn("flex", "items-center")).toBe("flex items-center");
  });
});
