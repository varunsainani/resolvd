import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { BarList } from "@/components/charts/bar-list";

describe("BarList share", () => {
  it("shows each item's rounded share of the total", () => {
    render(
      <BarList
        items={[
          { key: "a", label: "A", value: 1 },
          { key: "b", label: "B", value: 3 },
        ]}
      />,
    );
    expect(screen.getByText("25%")).toBeInTheDocument(); // 1 / 4
    expect(screen.getByText("75%")).toBeInTheDocument(); // 3 / 4
  });
});
