import { useMemo } from "react";
import { Label, Pie, PieChart } from "recharts"
import { Item, ItemActions, ItemContent, ItemGroup, ItemMedia } from "../ui/item";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "../ui/chart";

import { getOutflowChartData } from "@/lib/statsHelper";
import { useTransactions } from "@/api/hooks/useTransactions";
import { useCategories } from "@/api/hooks/useCategories";
import EmptyStats from "@/components/shared/empty/EmptyStats";

interface OutflowsProps {
  selectedRange: "7d" | "30d" | "lastMonth";
  selectedAccountId?: number;
}

/**
 * A complete component that renders a diagram for the money outflow.
 */
export default function Outflows({ selectedRange, selectedAccountId }: OutflowsProps) {
  const { transactions } = useTransactions();
  const { categories } = useCategories();

  // The data the diagram renders from.
  // Also sorts the data descending by the amount.
  const chartData = useMemo(() => {
    if (!transactions.data || !categories.data) return undefined;

    return getOutflowChartData({
      range: selectedRange,
      accountId: selectedAccountId ?? -1,
      transactions: transactions.data,
      categories: categories.data
    }).sort((a, b) => b.categoryAmount - a.categoryAmount);
  }, [selectedRange, selectedAccountId, transactions.data, categories.data]);

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

  // The total amount to be displayed in the pie chart.
  const totalAmount = useMemo(() => {
    return chartData?.reduce((acc, curr) => acc + curr.categoryAmount, 0) || 0;
  }, [chartData]);

  return (
    <div className="border border-neutral-200 rounded-lg p-4 space-y-10">

      {/* Rendering the actual chart */}
      {chartData?.length === 0 && <EmptyStats />}
      {chartData?.length != 0 &&
        <div className="space-y-10">
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
          {chartData?.length != 0 &&
            <div>
              <div className="flex flex-row justify-between text-sm text-neutral-500 pb-2 px-4">
                <div>Category</div>
                <div>Amount</div>
              </div>
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
          }
        </div>}
    </div>
  )
}