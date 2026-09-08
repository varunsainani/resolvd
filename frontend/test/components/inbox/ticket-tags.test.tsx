import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { TicketTags } from "@/components/inbox/ticket-tags";
import type { Tag } from "@/types";

const tags: Tag[] = [
  { name: "billing", color: "#0d9488" },
  { name: "refund", color: "#dc2626" },
  { name: "urgent", color: "#d97706" },
  { name: "vip", color: "#0284c7" },
  { name: "escalated", color: "#7c3aed" },
];

describe("TicketTags", () => {
  it("renders nothing when there are no tags", () => {
    const { container } = render(<TicketTags tags={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("caps visible chips and summarizes the overflow", () => {
    render(<TicketTags tags={tags} max={3} />);
    expect(screen.getByText("billing")).toBeInTheDocument();
    expect(screen.getByText("urgent")).toBeInTheDocument();
    expect(screen.queryByText("vip")).toBeNull();
    expect(screen.getByText("+2")).toBeInTheDocument();
  });
});
