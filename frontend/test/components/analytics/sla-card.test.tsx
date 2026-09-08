import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SlaCard } from "@/components/analytics/sla-card";
import { renderWithIntl } from "../../util/render";

describe("SlaCard", () => {
  it("shows the breach rate and both breach counts", () => {
    renderWithIntl(
      <SlaCard sla={{ firstResponseBreaches: 3, resolutionBreaches: 1, breachPercent: 8 }} />,
    );
    expect(screen.getByText("8%")).toBeInTheDocument();
    expect(screen.getByText("First-response breaches")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("flags a high breach rate with the danger tone", () => {
    const { container } = renderWithIntl(
      <SlaCard sla={{ firstResponseBreaches: 9, resolutionBreaches: 9, breachPercent: 40 }} />,
    );
    expect(container.querySelector(".bg-danger-soft")).not.toBeNull();
  });
});
