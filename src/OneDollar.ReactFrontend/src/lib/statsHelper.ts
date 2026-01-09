import type { Category } from "@/models/Category";
import type { ChartDataCategory } from "@/models/ChartDataCategories";
import type { Transaction } from "@/models/Transaction";

interface GetChartDataProps {
  range: "7d" | "30d" | "lastMonth";
  transactions: Transaction[];
  categories: Category[];
}

function getChartData({ range, transactions, categories }: GetChartDataProps): ChartDataCategory[] {
  if (!range) throw Error("No range present, cannot determine range to load data for.");

  let matchingTransactions: Transaction[] = [];

  switch (range) {
    case "7d":
      var start = Date.now();
      var end = Date.now() - (7 * 24 * 60 * 60 * 1000);

      matchingTransactions = transactions.filter((t) => {
        const transactionDate = new Date(t.timestamp).getTime();
        return transactionDate >= end && transactionDate <= start;
      }) || [];
      break;

    case "30d":
      var start = Date.now();
      var end = Date.now() - (30 * 24 * 60 * 60 * 1000);

      matchingTransactions = transactions.filter((t) => {
        const transactionDate = new Date(t.timestamp).getTime();
        return transactionDate >= end && transactionDate <= start;
      }) || [];
      break;
    
    default: 
      console.error("No range matched, cannot determine which transactions need to be analyzed.")
  }

  // create chartdata categories from the entries
  let chartCategories: ChartDataCategory[] = [];

  for (const t of matchingTransactions) {
    const categoryId = t.categoryId ?? -1;
    const existingCategory = chartCategories.find((c) => c.categoryId === categoryId);

    if (existingCategory) {
      existingCategory.categoryAmount += Math.abs(t.amount);
    } else {
      const matchedCategory = categories.find((c: Category) => c.categoryId === categoryId);
      
      chartCategories.push({
        categoryId: categoryId,
        categoryName: matchedCategory?.name ?? "Uncategorized",
        categoryAmount: Math.abs(t.amount),
        fill: `var(--color-${categoryId === -1 ? "other" : chartCategories.length})`,
      });
    }
  }


  return chartCategories;
}

export { getChartData }