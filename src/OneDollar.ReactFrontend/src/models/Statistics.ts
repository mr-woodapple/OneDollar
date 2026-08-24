export type StatisticsRange = "7d" | "30d" | "lastMonth" | "custom";

export type StatisticsDirection = "outflow" | "income";

export type StatisticsGrouping = "category" | "tag" | "account";

export interface StatisticsFilters {
  range: StatisticsRange;
  customFrom?: string;
  customTo?: string;
  accountIds: number[];
  categoryIds: number[];
  tagIds: number[];
}

export interface StatisticsSummary {
  income: number;
  outflow: number;
  net: number;
  transactionCount: number;
}

export interface StatisticsTrendPoint {
  date: string;
  label: string;
  income: number;
  outflow: number;
  net: number;
}

export interface StatisticsBreakdownRow {
  id: string;
  name: string;
  icon?: string;
  amount: number;
  percentage: number;
  fill: string;
}

export interface StatisticsDashboardData {
  summary: StatisticsSummary;
  trend: StatisticsTrendPoint[];
  breakdown: StatisticsBreakdownRow[];
}
