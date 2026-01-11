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
        categoryIcon: matchedCategory?.icon,
        fill: getDominantColorFromEmoji(matchedCategory?.icon),
      });
    }
  }


  return chartCategories;
}

/**
 * Get the most dominant color from a given emoji. If no emoji is present,
 * a grey will be used as a default.
 * 
 * @param emoji The emoji string to extract color for.
 * @returns The most dominant color as an rgb string.
 */
function getDominantColorFromEmoji(emoji?: string): string {
  if (emoji === undefined) return "#CCCCCC";

  const canvas = document.createElement("canvas");
  canvas.width = 30;
  canvas.height = 30;
  
  const ctx = canvas.getContext("2d");
  if (!ctx) return "#CCCCCC";

  ctx.font = "24px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(emoji, 15, 15);

  const imageData = ctx.getImageData(0, 0, 30, 30);
  const data = imageData.data;

  let r = 0, g = 0, b = 0, count = 0;

  for (let i = 0; i < data.length; i += 4) {
    const alpha = data[i + 3];
    if (alpha < 10) continue;

    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
    count++;
  }

  if (count === 0) return "#CCCCCC";

  r = Math.round(r / count);
  g = Math.round(g / count);
  b = Math.round(b / count);

  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

export { getChartData }