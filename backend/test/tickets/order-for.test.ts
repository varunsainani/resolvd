import { describe, expect, it } from "vitest";

import { orderFor } from "../../src/routes/tickets";

describe("orderFor", () => {
  it("defaults to newest first", () => {
    expect(orderFor(undefined)).toEqual([{ createdAt: "desc" }]);
    expect(orderFor("anything")).toEqual([{ createdAt: "desc" }]);
  });

  it("maps oldest and updated", () => {
    expect(orderFor("oldest")).toEqual([{ createdAt: "asc" }]);
    expect(orderFor("updated")).toEqual([{ updatedAt: "desc" }]);
  });

  it("orders by priority then recency", () => {
    expect(orderFor("priority")).toEqual([{ priority: "desc" }, { createdAt: "desc" }]);
  });
});
