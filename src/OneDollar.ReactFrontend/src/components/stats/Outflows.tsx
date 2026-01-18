import { useMemo } from "react";
import { Label, Pie, PieChart } from "recharts"
import { Item, ItemActions, ItemContent, ItemGroup, ItemMedia } from "../ui/item";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "../ui/chart";

import EmptyStats from "@/components/shared/empty/EmptyStats";
import type { ChartDataCategory } from "@/models/ChartDataCategories";

interface OutflowsProps {
  chartData?: ChartDataCategory[];
  totalAmount: number;
}

/**
 * A complete component that renders a diagram for the money outflow.
 */
export default function Outflows({ chartData, totalAmount }: OutflowsProps) {
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

  return (
    <div className="border border-neutral-200 rounded-lg p-4 space-y-10">

      {/* Rendering the actual chart */}
      {(!chartData || chartData.length === 0) && <EmptyStats />}
      {chartData && chartData.length !== 0 &&
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
                            {totalAmount.toLocaleString('en-GB', { style: 'currency', currency: 'EUR' })}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 50}
                            className="fill-muted-foreground text-xl"
                          >
                            Outflows
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
          {chartData?.length !== 0 &&
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
                      {c.categoryAmount.toLocaleString('en-GB', { style: 'currency', currency: 'EUR' })}
                    </ItemActions>
                  </Item>
                ))}
              </ItemGroup>
            </div>
          }
        </div>
      }
    </div>
  )
}