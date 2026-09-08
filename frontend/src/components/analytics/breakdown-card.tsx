import { BarList, ChartEmpty, type BarItem } from "@/components/charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// A titled card wrapping a horizontal bar breakdown, falling back to the empty
// placeholder when every value is zero.
export function BreakdownCard({ title, items }: { title: string; items: BarItem[] }) {
  const anyData = items.some((item) => item.value > 0);
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent>{anyData ? <BarList items={items} /> : <ChartEmpty />}</CardContent>
    </Card>
  );
}
