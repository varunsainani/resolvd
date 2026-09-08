import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AnalyticsEmpty } from "@/components/analytics/analytics-empty";
import { renderWithIntl } from "../../util/render";

describe("AnalyticsEmpty", () => {
  it("renders the localized empty message", () => {
    renderWithIntl(<AnalyticsEmpty />);
    expect(screen.getByText("Not enough data to chart yet.")).toBeInTheDocument();
  });
});
