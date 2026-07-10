import { useMemo } from "react";
import { ItemGroup, Item, ItemMedia, ItemContent, ItemTitle, ItemActions, ItemSeparator, ItemDescription } from "../ui/item"

import { useTransactions } from "@/api/hooks/useTransactions";
import { useCategories } from "@/api/hooks/useCategories";
import type { Category } from "@/models/Category";
import type { Transaction } from "@/models/Transaction"
import { Badge } from "../ui/badge";
import ErrorAlert from "../shared/alerts/ErrorAlert";
import EmptyTransactions from "../shared/empty/EmptyTransactions";
import { Skeleton } from "../ui/skeleton";

interface TransactionListProps {
  selectedAccountId?: number | null;
  onTransactionClick?: (transaction: Transaction) => void;
}

// Group entries by date and render group-by-group
export default function TransactionList({ selectedAccountId, onTransactionClick }: TransactionListProps) {
  const { transactions } = useTransactions();
  const { categories } = useCategories();
  
  // Lookup map, according to ai, this makes things faster by lowering rendering complexity.
  const categoryMap = useMemo(() => {
    if (!categories.data) return new Map();
    return new Map(categories.data.map((c: Category) => [c.categoryId, c]));
  }, [categories.data]);

  // Group transactions by day
  const groupedEntries: { [date: string]: Transaction[] } = useMemo(() => {
    return !transactions.isPending && !transactions.isError && transactions.data
      ? groupTransactionByDay(transactions.data.filter(t => !selectedAccountId || t.accountId === selectedAccountId))
      : {};
  }, [transactions.data, transactions.isPending, transactions.isError, selectedAccountId]);

  // Helper function to sort the Transactions by date.
  function groupTransactionByDay(transactions: Transaction[]) {
    // Sort transactions by date descending
    transactions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return transactions.reduce((group: { [date: string]: Transaction[] }, entry) => {
      const date = new Date(entry.timestamp).toISOString().split("T")[0];

      // Check if the key exists, if not create empty array
      if (!group[date]) group[date] = [];
      group[date].push(entry);

      return group;
    }, {});
  }

  // Generates a human readable date string from the JSON input
  function getHumandReadableDate(dateValue: string) {
    const options = {
      weekday: "long" as const,
      year: "numeric" as const,
      month: "long" as const,
      day: "2-digit" as const,
    };

    let date = new Date(dateValue);
    return date.toLocaleDateString("en-GB", options);
  };

  return (
    <>
      {
        transactions.isPending ? (<TransactionListSkeleton />) :
        transactions.isError ? (<ErrorAlert error={transactions.error} />) :
        transactions.data.length === 0 ? (<EmptyTransactions />) :
        (
          Object.entries(groupedEntries).map(([timestamp, entries]) => (
            <div key={timestamp}>
              <div className="text-sm text-neutral-500 pb-2 ps-4 mt-5">
                {getHumandReadableDate(timestamp)}
              </div>
              <ItemGroup className="border border-neutral-200 rounded-lg">
                {Array.isArray(entries) && entries.map((entry: Transaction, index: number) => {
                  const category = categoryMap.get(entry.categoryId) ?? entry.category;

                  return (
                    <div key={index} onClick={() => onTransactionClick?.(entry)} className="cursor-pointer">
                      <Item key={entry.transactionId} size="sm">
                        { category && 
                          <ItemMedia>
                            { category.icon }
                          </ItemMedia>
                        }
                        
                        <ItemContent>
                          { category 
                            ? <ItemTitle>{category.name}</ItemTitle>
                            : <div>
                                <span className="rounded-full bg-neutral-200 py-1 px-2 text-xs text-neutral-700">No category selected.</span>
                              </div>
                          }

                          { entry.merchant && 
                            <ItemDescription>
                              {entry.merchant}
                            </ItemDescription>
                          }

                          { entry.tags && entry.tags.length > 0 &&
                            <div className="flex flex-row flex-wrap gap-1 mt-1">
                              {entry.tags.map((tag) => (
                                <Badge
                                  key={tag.tagId}
                                  style={{ backgroundColor: tag.color ?? "#a3a3a3" }}
                                  className="text-white text-[10px] px-1.5 py-0">
                                  {tag.name}
                                </Badge>
                              ))}
                            </div>
                          }
                        </ItemContent>

                        <ItemActions>
                          {entry.amount.toLocaleString('en-GB', { style: 'currency', currency: 'EUR' })}
                        </ItemActions>
                      </Item>

                      {index !== entries.length - 1 && <ItemSeparator />}
                    </div>
                  )
                })}
              </ItemGroup>
            </div>
          ))
        )
      }
    </>
  );
}

/**
 * Skeleton component to show while loading transactions,
 * dynamically varies in the number of groups and items.
 * 
 * @returns The skeleton component.
 */
function TransactionListSkeleton() {

  // Get a random number for a given max value.
  function getRandomInt(max: number) {
    return Math.floor(Math.random() * max) + 1; // Ensure at least 1
  }

  return(
     <div className="flex flex-col gap-2">
      {[...Array(getRandomInt(2))].map((_, i) => {
        const items = [...Array(getRandomInt(4))];

        return (
          <div key={i} className="mt-5">
            <Skeleton className="h-4 w-[250px] mb-2" />
            <ItemGroup className="border border-neutral-200 rounded-lg">
              {items.map((_, j) => (
                <div className="gap-2" key={j}>
                  <div className="p-2">
                    <Skeleton className="h-8 w-full" />
                  </div>
                  {j !== items.length - 1 && <ItemSeparator />}
                </div>
              ))}
            </ItemGroup>
          </div>
        )
      })}
    </div>
  )
}
