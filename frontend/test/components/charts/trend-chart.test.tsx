import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { TrendChart } from "@/components/charts/trend-chart";
import type { TrendPoint } from "@/types";
import { renderWithIntl } from "../../util/render";

function series(counts: number[]): TrendPoint[] {
  return counts.map((count, i) => ({ date: `2026-09-${String(i + 1).padStart(2, "0")}`, count }));
}

describe("TrendChart", () => {
  it("renders one column per day", () => {
    const { container } = renderWithIntl(<TrendChart points={series([0, 1, 2, 0, 3])} />);
    expect(container.querySelectorAll("[title]")).toHaveLength(5);
  });

  it("shows the empty placeholder when every day is zero", () => {
    renderWithIntl(<TrendChart points={series([0, 0, 0])} />);
    expect(screen.getByText("Not enough data to chart yet.")).toBeInTheDocument();
  });
});
