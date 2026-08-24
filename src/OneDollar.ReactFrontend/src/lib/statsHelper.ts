import type { Account } from "@/models/Account";
import type { Category } from "@/models/Category";
import type {
  StatisticsBreakdownRow,
  StatisticsDashboardData,
  StatisticsDirection,
  StatisticsFilters,
  StatisticsGrouping,
  StatisticsRange,
  StatisticsTrendPoint,
} from "@/models/Statistics";
import type { Tag } from "@/models/Tag";
import type { Transaction } from "@/models/Transaction";

export const UNCATEGORIZED_ID = -1;
export const UNTAGGED_ID = -1;

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

interface StatisticsDateRange {
  start: Date;
  end: Date;
}

interface GetStatisticsDataProps {
  filters: StatisticsFilters;
  direction: StatisticsDirection;
  grouping: StatisticsGrouping;
  transactions: Transaction[];
  accounts: Account[];
  categories: Category[];
  tags: Tag[];
  now?: Date;
}

export function getStatisticsDateRange(
  range: StatisticsRange,
  now = new Date(),
  customFrom?: string,
  customTo?: string,
): StatisticsDateRange {
  const end = new Date(now);
  let start: Date;

  if (range === "custom") {
    const selectedStart = customFrom ? parseLocalDateKey(customFrom) : startOfDay(now);
    const selectedEnd = customTo ? endOfDay(parseLocalDateKey(customTo)) : endOfDay(selectedStart);

    return selectedStart <= selectedEnd
      ? { start: selectedStart, end: selectedEnd }
      : { start: startOfDay(selectedEnd), end: endOfDay(selectedStart) };
  }

  if (range === "lastMonth") {
    start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    return {
      start,
      end: new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999),
    };
  }

  const days = range === "7d" ? 7 : 30;
  start = startOfDay(now);
  start.setDate(start.getDate() - (days - 1));

  return { start, end };
}

export function getStatisticsData({
  filters,
  direction,
  grouping,
  transactions,
  accounts,
  categories,
  tags,
  now = new Date(),
}: GetStatisticsDataProps): StatisticsDashboardData {
  const dateRange = getStatisticsDateRange(
    filters.range,
    now,
    filters.customFrom,
    filters.customTo,
  );
  const accountIds = new Set(filters.accountIds);
  const categoryIds = new Set(filters.categoryIds);
  const tagIds = new Set(filters.tagIds);

  const filteredTransactions = transactions.filter((transaction) => {
    if (transaction.isTransfer || transaction.amount === 0) return false;

    const timestamp = new Date(transaction.timestamp);
    if (
      Number.isNaN(timestamp.getTime())
      || timestamp < dateRange.start
      || timestamp > dateRange.end
    ) {
      return false;
    }

    if (accountIds.size > 0 && !accountIds.has(transaction.accountId)) {
      return false;
    }

    const categoryId = transaction.categoryId ?? UNCATEGORIZED_ID;
    if (categoryIds.size > 0 && !categoryIds.has(categoryId)) {
      return false;
    }

    if (tagIds.size > 0) {
      const transactionTagIds = transaction.tags?.length
        ? transaction.tags.map((tag) => tag.tagId).filter((id): id is number => id !== undefined)
        : [UNTAGGED_ID];

      if (!transactionTagIds.some((id) => tagIds.has(id))) {
        return false;
      }
    }

    return true;
  });

  const income = sumAmounts(filteredTransactions, "income");
  const outflow = sumAmounts(filteredTransactions, "outflow");

  const summary = {
    income,
    outflow,
    net: income - outflow,
    transactionCount: filteredTransactions.length,
  };

  return {
    summary,
    trend: buildTrend(filteredTransactions, dateRange),
    breakdown: buildBreakdown({
      transactions: filteredTransactions,
      accounts,
      categories,
      tags,
      direction,
      grouping,
      total: direction === "income" ? income : outflow,
    }),
  };
}

function sumAmounts(
  transactions: Transaction[],
  direction: StatisticsDirection,
): number {
  return transactions.reduce((total, transaction) => {
    if (direction === "income" && transaction.amount > 0) {
      return total + transaction.amount;
    }

    if (direction === "outflow" && transaction.amount < 0) {
      return total + Math.abs(transaction.amount);
    }

    return total;
  }, 0);
}

function buildTrend(
  transactions: Transaction[],
  range: StatisticsDateRange,
): StatisticsTrendPoint[] {
  const points = new Map<string, StatisticsTrendPoint>();
  const cursor = startOfDay(range.start);
  const finalDay = startOfDay(range.end);

  while (cursor <= finalDay) {
    const key = toLocalDateKey(cursor);
    points.set(key, {
      date: key,
      label: cursor.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
      }),
      income: 0,
      outflow: 0,
      net: 0,
    });
    cursor.setDate(cursor.getDate() + 1);
  }

  for (const transaction of transactions) {
    const point = points.get(toLocalDateKey(new Date(transaction.timestamp)));
    if (!point) continue;

    if (transaction.amount > 0) {
      point.income += transaction.amount;
    } else {
      point.outflow += Math.abs(transaction.amount);
    }
    point.net = point.income - point.outflow;
  }

  return [...points.values()];
}

interface BuildBreakdownProps {
  transactions: Transaction[];
  accounts: Account[];
  categories: Category[];
  tags: Tag[];
  direction: StatisticsDirection;
  grouping: StatisticsGrouping;
  total: number;
}

function buildBreakdown({
  transactions,
  accounts,
  categories,
  tags,
  direction,
  grouping,
  total,
}: BuildBreakdownProps): StatisticsBreakdownRow[] {
  const accountMap = new Map(accounts.map((account) => [account.accountId, account]));
  const categoryMap = new Map(categories.map((category) => [category.categoryId, category]));
  const tagMap = new Map(tags.map((tag) => [tag.tagId, tag]));
  const rows = new Map<string, Omit<StatisticsBreakdownRow, "percentage" | "fill">>();

  const matchingTransactions = transactions.filter((transaction) => (
    direction === "income" ? transaction.amount > 0 : transaction.amount < 0
  ));

  for (const transaction of matchingTransactions) {
    const amount = Math.abs(transaction.amount);

    if (grouping === "account") {
      const account = accountMap.get(transaction.accountId);
      addToBreakdown(rows, String(transaction.accountId), account?.name ?? "Unknown account", amount);
      continue;
    }

    if (grouping === "category") {
      const categoryId = transaction.categoryId ?? UNCATEGORIZED_ID;
      const category = categoryMap.get(categoryId);
      addToBreakdown(
        rows,
        String(categoryId),
        category?.name ?? "Uncategorized",
        amount,
        category?.icon,
      );
      continue;
    }

    if (!transaction.tags?.length) {
      addToBreakdown(rows, String(UNTAGGED_ID), "Untagged", amount);
      continue;
    }

    for (const transactionTag of transaction.tags) {
      const id = transactionTag.tagId ?? UNTAGGED_ID;
      const tag = tagMap.get(id) ?? transactionTag;
      addToBreakdown(rows, String(id), tag.name ?? "Unnamed tag", amount);
    }
  }

  return [...rows.values()]
    .sort((a, b) => b.amount - a.amount)
    .map((row, index) => ({
      ...row,
      percentage: total === 0 ? 0 : (row.amount / total) * 100,
      fill: CHART_COLORS[index % CHART_COLORS.length],
    }));
}

function addToBreakdown(
  rows: Map<string, Omit<StatisticsBreakdownRow, "percentage" | "fill">>,
  id: string,
  name: string,
  amount: number,
  icon?: string,
) {
  const row = rows.get(id);
  if (row) {
    row.amount += amount;
    return;
  }

  rows.set(id, { id, name, icon, amount });
}

function startOfDay(value: Date): Date {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate());
}

function endOfDay(value: Date): Date {
  return new Date(
    value.getFullYear(),
    value.getMonth(),
    value.getDate(),
    23,
    59,
    59,
    999,
  );
}

function parseLocalDateKey(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function toLocalDateKey(value: Date): string {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
