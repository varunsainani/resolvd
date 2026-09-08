import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PriorityBadge } from "@/components/domain/priority-badge";
import { renderWithIntl } from "../../util/render";

describe("PriorityBadge", () => {
  it("renders urgent with the danger tone", () => {
    renderWithIntl(<PriorityBadge priority="URGENT" />);
    expect(screen.getByText("Urgent")).toHaveClass("bg-danger-soft");
  });

  it("renders low with the neutral tone", () => {
    renderWithIntl(<PriorityBadge priority="LOW" />);
    expect(screen.getByText("Low")).toHaveClass("bg-muted");
  });
});
