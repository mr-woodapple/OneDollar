import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
} from "recharts";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { StatisticsTrendPoint } from "@/models/Statistics";

const chartConfig = {
  income: {
    label: "Income",
    color: "var(--chart-2)",
  },
  outflow: {
    label: "Outflow",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

interface CashFlowTrendProps {
  data: StatisticsTrendPoint[];
}

export default function CashFlowTrend({ data }: CashFlowTrendProps) {
  return (
    <Card className="gap-4 py-5 shadow-none">
      <CardHeader className="gap-1 px-4 sm:px-5">
        <CardTitle>Cash-flow trend</CardTitle>
        <CardDescription>Income and outflow over the selected period</CardDescription>
      </CardHeader>
      <CardContent className="px-2 sm:px-4">
        <ChartContainer config={chartConfig} className="h-64 w-full aspect-auto">
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{ top: 8, right: 8, left: 8, bottom: 0 }}
          >
            <defs>
              <linearGradient id="fillIncome" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-income)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-income)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillOutflow" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-outflow)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-outflow)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => formatTrendDate(String(value))}
            />
            <ChartTooltip
              cursor={false}
              content={(
                <ChartTooltipContent
                  indicator="dot"
                  labelFormatter={(value) => formatLongDate(String(value))}
                  formatter={(value, name) => (
                    <div className="flex w-full min-w-32 items-center justify-between gap-4">
                      <span className="text-muted-foreground">
                        {chartConfig[name as keyof typeof chartConfig]?.label ?? name}
                      </span>
                      <span className="font-mono font-medium tabular-nums text-foreground">
                        {formatCurrency(Number(value))}
                      </span>
                    </div>
                  )}
                />
              )}
            />
            <Area
              dataKey="outflow"
              type="natural"
              fill="url(#fillOutflow)"
              fillOpacity={0.4}
              stroke="var(--color-outflow)"
            />
            <Area
              dataKey="income"
              type="natural"
              fill="url(#fillIncome)"
              fillOpacity={0.4}
              stroke="var(--color-income)"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
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

function formatTrendDate(value: string) {
  return fromDateKey(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });
}

function formatLongDate(value: string) {
  return fromDateKey(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function fromDateKey(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}
