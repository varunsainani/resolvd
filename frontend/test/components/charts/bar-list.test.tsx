import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { BarList } from "@/components/charts/bar-list";

const items = [
  { key: "a", label: "Alpha", value: 2 },
  { key: "b", label: "Beta", value: 8 },
  { key: "c", label: "Gamma", value: 4 },
];

describe("BarList", () => {
  it("renders a row per item", () => {
    render(<BarList items={items} />);
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("Beta")).toBeInTheDocument();
    expect(screen.getByText("Gamma")).toBeInTheDocument();
  });

  it("scales all bars against the largest value", () => {
    const { container } = render(<BarList items={items} />);
    const fills = container.querySelectorAll<HTMLElement>("[style]");
    expect(fills[0]).toHaveStyle({ width: "25%" }); // 2 / 8
    expect(fills[1]).toHaveStyle({ width: "100%" }); // 8 / 8
    expect(fills[2]).toHaveStyle({ width: "50%" }); // 4 / 8
  });
});
