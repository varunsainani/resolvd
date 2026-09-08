import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ResponseTimesCard } from "@/components/analytics/response-times-card";
import { renderWithIntl } from "../../util/render";

describe("ResponseTimesCard", () => {
  it("formats minute values as durations", () => {
    renderWithIntl(
      <ResponseTimesCard avgFirstResponseMinutes={135} avgResolutionMinutes={40} />,
    );
    expect(screen.getByText("2h 15m")).toBeInTheDocument();
    expect(screen.getByText("40m")).toBeInTheDocument();
  });

  it("shows a dash when a metric has no data", () => {
    renderWithIntl(
      <ResponseTimesCard avgFirstResponseMinutes={null} avgResolutionMinutes={null} />,
    );
    expect(screen.getAllByText("—")).toHaveLength(2);
  });
});
