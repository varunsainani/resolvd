import type { AnalyticsOverview } from "@/types";
import { CategoryBreakdown } from "./category-breakdown";
import { ChannelBreakdown } from "./channel-breakdown";
import { PriorityBreakdown } from "./priority-breakdown";
import { SentimentBreakdown } from "./sentiment-breakdown";
import { StatusBreakdown } from "./status-breakdown";

// The five categorical breakdowns in a responsive two-column grid.
export function BreakdownGrid({ data }: { data: AnalyticsOverview }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <StatusBreakdown data={data.byStatus} />
      <PriorityBreakdown data={data.byPriority} />
      <ChannelBreakdown data={data.byChannel} />
      <SentimentBreakdown data={data.bySentiment} />
      <CategoryBreakdown data={data.byCategory} />
    </div>
  );
}
