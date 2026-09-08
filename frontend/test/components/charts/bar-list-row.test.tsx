import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { BarListRow } from "@/components/charts/bar-list-row";

describe("BarListRow", () => {
  it("renders the label and value", () => {
    render(<BarListRow label="Open" value={7} max={10} />);
    expect(screen.getByText("Open")).toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument();
  });

  it("sizes the bar as a percentage of the max", () => {
    const { container } = render(<BarListRow label="High" value={5} max={10} />);
    const fill = container.querySelector<HTMLElement>("[style]");
    expect(fill).toHaveStyle({ width: "50%" });
  });

  it("renders an empty bar when the max is zero", () => {
    const { container } = render(<BarListRow label="None" value={0} max={0} />);
    const fill = container.querySelector<HTMLElement>("[style]");
    expect(fill).toHaveStyle({ width: "0%" });
  });
});
