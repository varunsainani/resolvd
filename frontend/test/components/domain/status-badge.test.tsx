import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { StatusBadge } from "@/components/domain/status-badge";
import { renderWithIntl } from "../../util/render";

describe("StatusBadge", () => {
  it("renders the localized status label with the info tone", () => {
    renderWithIntl(<StatusBadge status="OPEN" />);
    const badge = screen.getByText("Open");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("bg-info-soft");
  });

  it("uses the success tone for resolved", () => {
    renderWithIntl(<StatusBadge status="RESOLVED" />);
    expect(screen.getByText("Resolved")).toHaveClass("bg-success-soft");
  });
});
