import AccountSwitcher from "@/components/home/AccountSwitcher";
import TransactionList from "@/components/home/TransactionList";
import ErrorAlert from "@/components/shared/alerts/ErrorAlert";
import type { Transaction } from "@/models/Transaction";

interface HomeViewProps {
  transactions: Transaction[];
  fetching: boolean;
  error: string | null;
  onTransactionClick?: (transaction: Transaction) => void;
}

export default function HomeView({ transactions, fetching, error, onTransactionClick }: HomeViewProps) {

  return (
    <div className="m-5">
      <AccountSwitcher />

      {/* TODO: Re-enable at a later stage with proper implementation */}
      {/* <Balance />  */}

      {fetching && <div> Loading... </div>}
      {!fetching && error && <ErrorAlert errorMessage={error} />}
      {!fetching && !error && <TransactionList transactions={transactions} onTransactionClick={onTransactionClick} />}
    </div>
  )
}