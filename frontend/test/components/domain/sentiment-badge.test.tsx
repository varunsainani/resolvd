import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SentimentBadge } from "@/components/domain/sentiment-badge";
import { renderWithIntl } from "../../util/render";

describe("SentimentBadge", () => {
  it("renders negative sentiment with the danger tone", () => {
    renderWithIntl(<SentimentBadge sentiment="NEGATIVE" />);
    expect(screen.getByText("Negative")).toHaveClass("bg-danger-soft");
  });

  it("renders positive sentiment with the success tone", () => {
    renderWithIntl(<SentimentBadge sentiment="POSITIVE" />);
    expect(screen.getByText("Positive")).toHaveClass("bg-success-soft");
  });
});
