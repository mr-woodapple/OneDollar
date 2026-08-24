import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type {
  StatisticsBreakdownRow,
  StatisticsDirection,
  StatisticsGrouping,
} from "@/models/Statistics";

interface StatisticsBreakdownProps {
  rows: StatisticsBreakdownRow[];
  direction: StatisticsDirection;
  grouping: StatisticsGrouping;
  onDirectionChange: (direction: StatisticsDirection) => void;
  onGroupingChange: (grouping: StatisticsGrouping) => void;
}

const MAX_VISIBLE_ROWS = 8;

export default function StatisticsBreakdown({
  rows,
  direction,
  grouping,
  onDirectionChange,
  onGroupingChange,
}: StatisticsBreakdownProps) {
  const visibleRows = rows.slice(0, MAX_VISIBLE_ROWS);
  const maximum = visibleRows[0]?.amount ?? 0;

  return (
    <Card className="gap-5 py-5 shadow-none">
      <CardHeader className="gap-1 px-4 sm:px-5">
        <CardTitle>Breakdown</CardTitle>
        <CardDescription>
          Compare where money moves by category, tag, or account
        </CardDescription>
      </CardHeader>

      <CardContent className="min-w-0 space-y-5 px-4 sm:px-5">
        <Tabs
          value={direction}
          onValueChange={(value) => onDirectionChange(value as StatisticsDirection)}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="outflow">Outflows</TabsTrigger>
            <TabsTrigger value="income">Income</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="min-w-0 space-y-2">
          <Label>Group by</Label>
          <Tabs
            value={grouping}
            onValueChange={(value) => onGroupingChange(value as StatisticsGrouping)}
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="category">Category</TabsTrigger>
              <TabsTrigger value="tag">Tag</TabsTrigger>
              <TabsTrigger value="account">Account</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {visibleRows.length === 0 ? (
          <div className="rounded-xl border border-dashed px-4 py-10 text-center">
            <p className="font-medium">No {direction} data</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try another date range or adjust the active filters.
            </p>
          </div>
        ) : (
          <div className="min-w-0 space-y-5">
            {visibleRows.map((row) => (
              <div key={row.id} className="min-w-0 space-y-2">
                <div className="flex min-w-0 items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2">
                    {row.icon && (
                      <span className="shrink-0" aria-hidden="true">
                        {row.icon}
                      </span>
                    )}
                    <span className="truncate text-sm font-medium" title={row.name}>
                      {row.name}
                    </span>
                  </div>
                  <div className="flex shrink-0 items-baseline gap-1.5 text-right">
                    <span className="text-sm font-medium tabular-nums">
                      {formatCurrency(row.amount)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {row.percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <Progress
                  value={maximum === 0 ? 0 : (row.amount / maximum) * 100}
                  aria-label={`${row.name}: ${formatCurrency(row.amount)}`}
                />
              </div>
            ))}

            {rows.length > MAX_VISIBLE_ROWS && (
              <p className="text-center text-xs text-muted-foreground">
                Showing the top {MAX_VISIBLE_ROWS} of {rows.length} groups
              </p>
            )}

            {grouping === "tag" && (
              <p className="rounded-lg bg-muted p-3 text-xs text-muted-foreground">
                Transactions with multiple tags count toward each tag, so percentages can overlap.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function formatCurrency(value: number) {
  return value.toLocaleString("en-GB", {
    style: "currency",
    currency: "EUR",
  });
}
