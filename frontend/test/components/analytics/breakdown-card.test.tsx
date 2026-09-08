import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { BreakdownCard } from "@/components/analytics/breakdown-card";
import { renderWithIntl } from "../../util/render";

describe("BreakdownCard", () => {
  it("renders the bars when there is data", () => {
    renderWithIntl(
      <BreakdownCard
        title="By status"
        items={[
          { key: "OPEN", label: "Open", value: 4 },
          { key: "RESOLVED", label: "Resolved", value: 6 },
        ]}
      />,
    );
    expect(screen.getByText("By status")).toBeInTheDocument();
    expect(screen.getByText("Open")).toBeInTheDocument();
    expect(screen.getByText("Resolved")).toBeInTheDocument();
  });

  it("falls back to the empty placeholder when all values are zero", () => {
    renderWithIntl(
      <BreakdownCard
        title="By status"
        items={[{ key: "OPEN", label: "Open", value: 0 }]}
      />,
    );
    expect(screen.getByText("Not enough data to chart yet.")).toBeInTheDocument();
  });
});
