import { useMemo, useState } from "react";
import { Label, Pie, PieChart } from "recharts"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartContainer, type ChartConfig } from "../ui/chart";

import { getChartData } from "@/lib/statsHelper";
import { useTransactions } from "@/api/hooks/useTransactions";
import { useCategories } from "@/api/hooks/useCategories";

/**
 * 
 * @returns 
 */
export default function Outflows() {
  const [selectedRange, setSelectedRange] = useState<"7d" | "30d" | "lastMonth">("30d");

  const { transactions } = useTransactions();
  const { categories } = useCategories();

  const chartData = useMemo(() => {
    if (!transactions.data || !categories.data) return undefined;

    return getChartData({ 
      range: selectedRange, 
      transactions: transactions.data, 
      categories: categories.data 
    });
  }, [selectedRange]);

  const chartConfig = {
    safari: {
      label: "Safari",
    },
  } satisfies ChartConfig

  return (
    <div className="border border-neutral-200 rounded-lg p-4 space-y-10">
      {/* Range selector */}
      <div className="rangeSelector">
        <Select defaultValue="30d" onValueChange={(v) => setSelectedRange(v as "7d" | "30d" | "lastMonth")}>
          <SelectTrigger>
            <SelectValue placeholder="Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
              <SelectItem value="lastMonth">Last Month</SelectItem>
              <SelectItem value="365d">365 Days</SelectItem>
              <SelectItem value="lastYear">Last Year</SelectItem>
              <SelectItem value="total">Total</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Actual chart */}
      <div className="pieChart">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-w-[75vw]"
        >
          <PieChart>
            <Pie
              data={chartData}
              innerRadius="90%"
              outerRadius="100%"
              cornerRadius="50%"
              paddingAngle={5}
              dataKey="categoryAmount"
              isAnimationActive={false}
            >
              <Label content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-foreground text-4xl font-semibold"
                      >
                        2500,99 €
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 50}
                        className="fill-muted-foreground text-2xl"
                      >
                        Visitors
                      </tspan>
                    </text>
                  )
                }
              }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </div>

      {/* Used Categories */}
      <div className="dbg">
        {chartData?.map((c) => (
          <div key={c.categoryId}>
            {c.categoryName} - {c.categoryAmount.toFixed(2)} €
          </div>
        ))}
      </div>
    </div>
  )
}