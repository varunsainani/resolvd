import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ChartEmpty } from "@/components/charts/chart-empty";
import { renderWithIntl } from "../../util/render";

describe("ChartEmpty", () => {
  it("renders the localized empty message", () => {
    renderWithIntl(<ChartEmpty />);
    expect(screen.getByText("Not enough data to chart yet.")).toBeInTheDocument();
  });
});
