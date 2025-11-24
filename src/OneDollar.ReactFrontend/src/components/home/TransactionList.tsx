import EmptyTransactions from "../shared/empty/EmptyTransactions";
import { ItemGroup, Item, ItemMedia, ItemContent, ItemTitle, ItemActions, ItemSeparator } from "../ui/item"

import type { Transaction } from "@/models/Transaction"

interface TransactionListProps {
  transactions: Transaction[];
  onTransactionClick?: (transaction: Transaction) => void;
}

// Group entries by date and render group-by-group
export default function TransactionList({ transactions, onTransactionClick }: TransactionListProps) {
  const groupedEntries = groupTransactionByDay(transactions);

  // Helper function to sort the Transactions by date.
  function groupTransactionByDay(Transactions: Transaction[]) {
    return Transactions.reduce((group: { [date: string]: Transaction[] }, entry) => {
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
    return date.toLocaleDateString("de-DE", options);
  }

  return (
    <>
      {transactions.length === 0 && <EmptyTransactions />}

      {groupedEntries &&
        Object.entries(groupedEntries).map(([timestamp, entries]) => (
          <div key={timestamp}>
            <div className="text-sm text-neutral-500 pb-2 ps-4 mt-5">
              {getHumandReadableDate(timestamp)}
            </div>
            <ItemGroup className="border border-neutral-200 rounded-lg">
              {Array.isArray(entries) && entries.map((entry: Transaction, index: number) => (
                <div key={index} onClick={() => onTransactionClick?.(entry)} className="cursor-pointer">
                  <Item key={entry.transactionId} size="sm">
                    <ItemMedia>
                      {entry.category?.icon}
                    </ItemMedia>

                    <ItemContent>
                      <ItemTitle>{entry.category?.name}</ItemTitle>
                    </ItemContent>

                    <ItemActions>
                      {entry.amount.toString().replace(".", ",")} €
                    </ItemActions>
                  </Item>
                  {index !== entries.length - 1 && <ItemSeparator />}
                </div>
              ))}
            </ItemGroup>
          </div>
        ))
      }
    </>
  );
}
