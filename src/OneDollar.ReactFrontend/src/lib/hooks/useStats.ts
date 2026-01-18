import { useMemo } from "react";
import { useTransactions } from "@/api/hooks/useTransactions";
import { useCategories } from "@/api/hooks/useCategories";
import { getIncomesChartData, getOutflowChartData } from "@/lib/statsHelper";

/**
 * Custom hooks to calculate various values used on the statistics page.
 * 
 * @param selectedRange The selected date range as a string. See below for the allowed values.
 * @param selectedAccountId The id of the account to show stats for. "-1" if all accounts are included.
 * @returns 
 */
export function useStats(
  selectedRange: "7d" | "30d" | "lastMonth", 
  selectedAccountId?: number
) {
    const { transactions } = useTransactions();
    const { categories } = useCategories();

    const incomeChartData = useMemo(() => {
        if (!transactions.data || !categories.data) return undefined;

        return getIncomesChartData({
            range: selectedRange,
            accountId: selectedAccountId ?? -1,
            transactions: transactions.data,
            categories: categories.data
        }).sort((a, b) => b.categoryAmount - a.categoryAmount);
    }, [selectedRange, selectedAccountId, transactions.data, categories.data]);

    const outflowChartData = useMemo(() => {
        if (!transactions.data || !categories.data) return undefined;

        return getOutflowChartData({
            range: selectedRange,
            accountId: selectedAccountId ?? -1,
            transactions: transactions.data,
            categories: categories.data
        }).sort((a, b) => b.categoryAmount - a.categoryAmount);
    }, [selectedRange, selectedAccountId, transactions.data, categories.data]);

    const totalIncome = useMemo(() => {
        return incomeChartData?.reduce((acc, curr) => acc + curr.categoryAmount, 0) || 0;
    }, [incomeChartData]);

    const totalOutcome = useMemo(() => {
        return outflowChartData?.reduce((acc, curr) => acc + curr.categoryAmount, 0) || 0;
    }, [outflowChartData]);

    return {
        incomeChartData,
        outflowChartData,
        totalIncome,
        totalOutcome,
        isLoading: transactions.isPending || categories.isPending,
        isError: transactions.isError || categories.isError
    };
}
