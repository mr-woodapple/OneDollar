import { useState, useEffect } from "react";

import ErrorAlert from "@/components/shared/alerts/ErrorAlert";
import AccountSwitcher from "@/components/home/AccountSwitcher";
import TransactionList from "@/components/home/TransactionList";
import type { Transaction } from "@/models/Transaction";
import { useAccounts } from "@/hooks/useAccounts";

interface HomeViewProps {
  transactions: Transaction[];
  fetching: boolean;
  error: string | null;
  onTransactionClick?: (transaction: Transaction) => void;
}

export default function HomeView({ transactions, fetching, error, onTransactionClick }: HomeViewProps) {
  const { accounts, fetching: accountsFetching, error: accountsError } = useAccounts();
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(null);

  useEffect(() => {
    if (selectedAccountId === null && accounts && accounts.length > 0) {
      const savedId = localStorage.getItem("defaultAccount");
      if (savedId) {
        const found = accounts.find(a => a.accountId === Number(savedId));
        if (found) {
          setSelectedAccountId(found.accountId!);
          return;
        }
      }
      setSelectedAccountId(accounts[0].accountId!);
    }
  }, [accounts, selectedAccountId]);

  const filteredTransactions = selectedAccountId
    ? transactions.filter(t => t.accountId === selectedAccountId)
    : transactions;

  // TODO: Find solution for managing the state on the top level
  // const currentBalance = accounts?.find(a => a.accountId === selectedAccountId)?.balance || 0;

  return (
    <div className="m-5">
      <AccountSwitcher
        onAccountChange={setSelectedAccountId}
        selectedAccountId={selectedAccountId}
        accounts={accounts}
        fetching={accountsFetching}
        error={accountsError}
      />

      {/* TODO: Find solution for managing the state on the top level */}
      {/* {selectedAccountId && <Balance amount={Number(currentBalance)} />} */}

      {fetching && <div> Loading... </div>}
      {!fetching && error && <ErrorAlert errorMessage={error} />}
      {!fetching && !error && <TransactionList transactions={filteredTransactions} onTransactionClick={onTransactionClick} />}
    </div>
  )
}