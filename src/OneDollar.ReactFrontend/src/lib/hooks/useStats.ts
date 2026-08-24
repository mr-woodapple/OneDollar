import { useMemo } from "react";

import { useAccounts } from "@/api/hooks/useAccounts";
import { useCategories } from "@/api/hooks/useCategories";
import { useTags } from "@/api/hooks/useTags";
import { useTransactions } from "@/api/hooks/useTransactions";
import { getStatisticsData } from "@/lib/statsHelper";
import type {
  StatisticsDirection,
  StatisticsFilters,
  StatisticsGrouping,
} from "@/models/Statistics";

export function useStats(
  filters: StatisticsFilters,
  direction: StatisticsDirection,
  grouping: StatisticsGrouping,
) {
  const { transactions } = useTransactions();
  const { accounts } = useAccounts();
  const { categories } = useCategories();
  const { tags } = useTags();

  const data = useMemo(() => {
    if (!transactions.data || !accounts.data || !categories.data || !tags.data) {
      return undefined;
    }

    return getStatisticsData({
      filters,
      direction,
      grouping,
      transactions: transactions.data,
      accounts: accounts.data,
      categories: categories.data,
      tags: tags.data,
    });
  }, [
    accounts.data,
    categories.data,
    direction,
    filters,
    grouping,
    tags.data,
    transactions.data,
  ]);

  return {
    data,
    accounts: accounts.data ?? [],
    categories: categories.data ?? [],
    tags: tags.data ?? [],
    isLoading:
      transactions.isPending
      || accounts.isPending
      || categories.isPending
      || tags.isPending,
    error:
      transactions.error
      ?? accounts.error
      ?? categories.error
      ?? tags.error,
  };
}
