import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ChannelBadge } from "@/components/domain/channel-badge";
import { renderWithIntl } from "../../util/render";

describe("ChannelBadge", () => {
  it("renders the localized channel label", () => {
    renderWithIntl(<ChannelBadge channel="EMAIL" />);
    expect(screen.getByText("Email")).toBeInTheDocument();
  });

  it("keeps the label available to screen readers when icon-only", () => {
    renderWithIntl(<ChannelBadge channel="PHONE" iconOnly />);
    expect(screen.getByText("Phone")).toHaveClass("sr-only");
  });
});
