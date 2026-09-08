import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SlaBadge } from "@/components/domain/sla-badge";
import { renderWithIntl } from "../../util/render";

describe("SlaBadge", () => {
  it("shows Met once the milestone is met", () => {
    renderWithIntl(
      <SlaBadge milestone={{ state: "met", dueAt: null, minutesRemaining: null }} />,
    );
    expect(screen.getByText("Met")).toBeInTheDocument();
  });

  it("shows remaining time while on track", () => {
    renderWithIntl(
      <SlaBadge milestone={{ state: "ok", dueAt: null, minutesRemaining: 120 }} />,
    );
    expect(screen.getByText("2h left")).toBeInTheDocument();
  });

  it("shows how far overdue once breached", () => {
    renderWithIntl(
      <SlaBadge milestone={{ state: "breached", dueAt: null, minutesRemaining: -30 }} />,
    );
    expect(screen.getByText("30m overdue")).toBeInTheDocument();
  });
});
