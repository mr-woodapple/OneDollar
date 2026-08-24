import { useEffect, useRef, useState } from "react";

import EmptyStats from "../components/shared/empty/EmptyStats";
import CashFlowTrend from "@/components/stats/CashFlowTrend";
import StatisticsBreakdown from "@/components/stats/StatisticsBreakdown";
import StatisticsFilters from "@/components/stats/StatisticsFilters";
import StatisticsSummary from "@/components/stats/StatisticsSummary";
import ErrorAlert from "@/components/shared/alerts/ErrorAlert";
import { Skeleton } from "@/components/ui/skeleton";
import { useStats } from "@/lib/hooks/useStats";
import { UNCATEGORIZED_ID, UNTAGGED_ID } from "@/lib/statsHelper";
import type {
  StatisticsDirection,
  StatisticsFilters as StatisticsFilterState,
  StatisticsGrouping,
} from "@/models/Statistics";

const initialFilters: StatisticsFilterState = {
  range: "30d",
  accountIds: [],
  categoryIds: [],
  tagIds: [],
};

export default function Statistics() {
  const [filters, setFilters] = useState<StatisticsFilterState>(initialFilters);
  const [direction, setDirection] = useState<StatisticsDirection>("outflow");
  const [grouping, setGrouping] = useState<StatisticsGrouping>("category");
  const initializedDefaultAccount = useRef(false);
  const {
    data,
    accounts,
    categories,
    tags,
    isLoading,
    error,
  } = useStats(filters, direction, grouping);

  useEffect(() => {
    if (initializedDefaultAccount.current || accounts.length === 0) return;
    initializedDefaultAccount.current = true;

    const savedAccountId = localStorage.getItem("defaultAccount");
    if (!savedAccountId) return;

    const savedId = Number(savedAccountId);
    if (Number.isNaN(savedId)) return;

    if (accounts.some((account) => account.accountId === savedId)) {
      setFilters((current) => ({ ...current, accountIds: [savedId] }));
    }
  }, [accounts]);

  useEffect(() => {
    const accountIds = new Set(accounts.map((account) => account.accountId));
    const categoryIds = new Set([
      UNCATEGORIZED_ID,
      ...categories.map((category) => category.categoryId),
    ]);
    const tagIds = new Set([
      UNTAGGED_ID,
      ...tags.map((tag) => tag.tagId),
    ]);

    const validAccountIds = filters.accountIds.filter((id) => accountIds.has(id));
    const validCategoryIds = filters.categoryIds.filter((id) => categoryIds.has(id));
    const validTagIds = filters.tagIds.filter((id) => tagIds.has(id));

    if (
      validAccountIds.length !== filters.accountIds.length
      || validCategoryIds.length !== filters.categoryIds.length
      || validTagIds.length !== filters.tagIds.length
    ) {
      setFilters((current) => ({
        ...current,
        accountIds: validAccountIds,
        categoryIds: validCategoryIds,
        tagIds: validTagIds,
      }));
    }
  }, [
    accounts,
    categories,
    filters.accountIds,
    filters.categoryIds,
    filters.tagIds,
    tags,
  ]);

  return (
    <main className="mx-auto w-full max-w-screen-sm space-y-5 overflow-x-hidden px-4 py-5 sm:px-5">
      <div className="text-center">Statistics</div>

      <StatisticsFilters
        filters={filters}
        accounts={accounts}
        categories={categories}
        tags={tags}
        onChange={setFilters}
      />

      {isLoading ? (
        <StatisticsSkeleton />
      ) : error ? (
        <ErrorAlert error={error} />
      ) : data ? (
        <>
          <StatisticsSummary summary={data.summary} />

          {data.summary.transactionCount === 0 ? (
            <EmptyStats />
          ) : (
            <>
              <CashFlowTrend data={data.trend} />
              <StatisticsBreakdown
                rows={data.breakdown}
                direction={direction}
                grouping={grouping}
                onDirectionChange={setDirection}
                onGroupingChange={setGrouping}
              />
            </>
          )}
        </>
      ) : null}
    </main>
  );
}

function StatisticsSkeleton() {
  return (
    <div className="space-y-5" aria-label="Loading statistics">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Skeleton className="col-span-2 h-24 sm:col-span-1" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
      </div>
      <Skeleton className="h-80 w-full" />
      <Skeleton className="h-96 w-full" />
    </div>
  );
}
