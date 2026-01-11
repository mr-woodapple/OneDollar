import { useMemo, useState } from "react";
import { Label, Pie, PieChart } from "recharts"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "../ui/chart";

import { getChartData } from "@/lib/statsHelper";
import { useTransactions } from "@/api/hooks/useTransactions";
import { useCategories } from "@/api/hooks/useCategories";
import { Item, ItemActions, ItemContent, ItemGroup, ItemMedia } from "../ui/item";

/**
 * A complete component that renders a diagram for the money outflow.
 */
export default function Outflows() {
  const { transactions } = useTransactions();
  const { categories } = useCategories();
  
  const [selectedRange, setSelectedRange] = useState<"7d" | "30d" | "lastMonth">("30d");

  // The data the diagram renders from.
  // Also sorts the data descending by the amount.
  const chartData = useMemo(() => {
    if (!transactions.data || !categories.data) return undefined;

    return getChartData({
      range: selectedRange,
      transactions: transactions.data,
      categories: categories.data
    }).sort((a, b) => b.categoryAmount - a.categoryAmount);
  }, [selectedRange, transactions.data, categories.data]);

  // Config used to display the tooltips on the actual diagram.
  const chartConfig = useMemo(() => {
    const config: ChartConfig = {
      categoryAmount: {
        label: "Amount"
      }
    };
    
    if (chartData) {
      chartData.forEach((item) => {
        config[item.categoryName] = {
          label: item.categoryName,
          color: item.fill,
        };
      });
    }

    return config;
  }, [chartData]);

  const totalAmount = useMemo(() => {
    return chartData?.reduce((acc, curr) => acc + curr.categoryAmount, 0) || 0;
  }, [chartData]);

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
              {/* <SelectItem value="lastMonth">Last Month</SelectItem>
              <SelectItem value="365d">365 Days</SelectItem>
              <SelectItem value="lastYear">Last Year</SelectItem>
              <SelectItem value="total">Total</SelectItem> */}
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
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={chartData}
              innerRadius="90%"
              outerRadius="100%"
              cornerRadius="25%"
              paddingAngle={2}
              dataKey="categoryAmount"
              nameKey="categoryName"
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
                        {totalAmount.toLocaleString('en-UK', { style: 'currency', currency: 'EUR' })}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 50}
                        className="fill-muted-foreground text-xl"
                      >
                        Total Outflows
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
      <div>
        <ItemGroup className="bg-neutral-100 rounded-xl">
          {chartData?.map((c) => (
            <Item key={c.categoryId}>
              <ItemMedia>
                <span>{c.categoryIcon ?? <div className="bg-neutral-300 h-4 w-4 rounded-full"></div>}</span>
              </ItemMedia>
              <ItemContent>
                <span>{c.categoryName}</span>
              </ItemContent>

              <ItemActions>
                {c.categoryAmount.toLocaleString('en-UK', { style: 'currency', currency: 'EUR' })}
              </ItemActions>
            </Item>
          ))}
        </ItemGroup>
      </div>
    </div>
  )
}