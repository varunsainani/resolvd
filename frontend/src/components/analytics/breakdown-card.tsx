import { BarList, ChartEmpty, type BarItem } from "@/components/charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { totalCount } from "@/lib/chart";

// A titled card wrapping a horizontal bar breakdown, with the running total in
// the header. Falls back to the empty placeholder when there is no data.
export function BreakdownCard({ title, items }: { title: string; items: BarItem[] }) {
  const total = totalCount(items.map((item) => ({ count: item.value })));
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-sm">
          <span>{title}</span>
          <span className="text-xs font-normal tabular-nums text-muted-foreground">{total}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>{total > 0 ? <BarList items={items} /> : <ChartEmpty />}</CardContent>
    </Card>
  );
}
