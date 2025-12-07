import { useTransactions } from "@/api/hooks/useTransactions";
import EmptyTransactions from "../shared/empty/EmptyTransactions";
import { ItemGroup, Item, ItemMedia, ItemContent, ItemTitle, ItemActions, ItemSeparator, ItemDescription } from "../ui/item"
import type { Transaction } from "@/models/Transaction"
import ErrorAlert from "../shared/alerts/ErrorAlert";
import NoCategory from "./NoCategory";

interface TransactionListProps {
  selectedAccountId?: number | null;
  onTransactionClick?: (transaction: Transaction) => void;
}

// Group entries by date and render group-by-group
export default function TransactionList({ selectedAccountId, onTransactionClick }: TransactionListProps) {
  const { transactions } = useTransactions();

  const groupedEntries: { [date: string]: Transaction[] } = !transactions.isPending && !transactions.isError
    ? groupTransactionByDay(transactions.data.filter(t => !selectedAccountId || t.accountId === selectedAccountId))
    : {};

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
        transactions.isPending ? (<p className="dbg">Loading...</p>) :
        transactions.isError ? (<ErrorAlert error={transactions.error} />) :
        transactions.data.length === 0 ? (<EmptyTransactions />) :
        (
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
                        { entry.category 
                          ? entry.category.icon
                          : "?"
                        }
                      </ItemMedia>

                      <ItemContent>
                        <span>
                          {}
                        </span>
                        { entry.category 
                          ? <ItemTitle>{entry.category?.name}</ItemTitle>
                          : <NoCategory />
                        }

                        <ItemDescription>
                          {entry.merchant}
                        </ItemDescription>
                      </ItemContent>

                      <ItemActions>
                        {entry.amount.toFixed(2).toString().replace(".", ",")} €
                      </ItemActions>
                    </Item>
                    {index !== entries.length - 1 && <ItemSeparator />}
                  </div>
                ))}
              </ItemGroup>
            </div>
          ))
        )
      }
    </>
  );
}
