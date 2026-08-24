import type { ReactNode } from "react";
import { ArrowDownLeft, ArrowUpRight, WalletCards } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import type { StatisticsSummary as StatisticsSummaryData } from "@/models/Statistics";
import { cn } from "@/lib/utils";

interface StatisticsSummaryProps {
  summary: StatisticsSummaryData;
}

export default function StatisticsSummary({ summary }: StatisticsSummaryProps) {
  return (
    <section aria-label="Financial summary" className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      <SummaryCard
        label="Net cash flow"
        value={summary.net}
        icon={<WalletCards />}
        className="col-span-2 sm:col-span-1 sm:order-3"
        valueClassName={
          summary.net > 0
            ? "text-emerald-600 dark:text-emerald-400"
            : summary.net < 0
              ? "text-red-600 dark:text-red-400"
              : undefined
        }
      />
      <SummaryCard
        label="Income"
        value={summary.income}
        icon={<ArrowDownLeft />}
        iconClassName="text-emerald-600 dark:text-emerald-400"
        className="sm:order-1"
      />
      <SummaryCard
        label="Outflow"
        value={summary.outflow}
        icon={<ArrowUpRight />}
        iconClassName="text-red-600 dark:text-red-400"
        className="sm:order-2"
      />
    </section>
  );
}

interface SummaryCardProps {
  label: string;
  value: number;
  icon: ReactNode;
  className?: string;
  iconClassName?: string;
  valueClassName?: string;
}

function SummaryCard({
  label,
  value,
  icon,
  className,
  iconClassName,
  valueClassName,
}: SummaryCardProps) {
  const formattedValue = value.toLocaleString("en-GB", {
    style: "currency",
    currency: "EUR",
  });

  return (
    <Card className={cn("gap-0 py-0 shadow-none", className)}>
      <CardContent className="min-w-0 p-4">
        <div className="mb-3 flex items-center justify-between gap-2">
          <span className="text-sm text-muted-foreground">{label}</span>
          <span className={cn("[&_svg]:size-4", iconClassName)} aria-hidden="true">
            {icon}
          </span>
        </div>
        <p
          className={cn("truncate text-lg font-semibold tabular-nums sm:text-xl", valueClassName)}
          title={formattedValue}
        >
          {formattedValue}
        </p>
      </CardContent>
    </Card>
  );
}
