import { ItemGroup, Item, ItemMedia, ItemContent, ItemTitle, ItemActions, ItemSeparator } from "../ui/item"

import type { Transaction } from "@/models/Transaction"
import { TransactionData } from "@/content/TransactionData"

// Group entries by date and render group-by-group
export default function TransactionList() {
  const groupedEntries = groupTransactionByDay(TransactionData);

  // Helper function to sort the transactions by date.
  function groupTransactionByDay(transactions: Transaction[]) {
    return transactions.reduce((group: { [date: string]: Transaction[] }, entry) => {
      const date = entry.timestamp.split("T")[0];

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
      {groupedEntries &&
        Object.entries(groupedEntries).map(([timestamp, entries]) => (
          <div key={timestamp}>
            <div className="text-sm text-neutral-500 pb-2 mt-5">
              {getHumandReadableDate(timestamp)}
            </div>
            <ItemGroup className="border border-neutral-200 rounded-lg">
              {Array.isArray(entries) && entries.map((entry: Transaction, index: number) => (
                <>
                  <Item key={entry.id} size="sm">
                    <ItemMedia>
                      {entry.category.icon}
                    </ItemMedia>

                    <ItemContent>
                      <ItemTitle>{entry.category.name}</ItemTitle>
                    </ItemContent>

                    <ItemActions>
                      {entry.amount.toString().replace(".", ",")} €
                    </ItemActions>
                  </Item>
                  {index !== entries.length - 1 && <ItemSeparator />}
                </>
              ))}
            </ItemGroup>
          </div>
        ))
      }
    </>
  );
}
