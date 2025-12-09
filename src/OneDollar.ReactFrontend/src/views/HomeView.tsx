import { useState, useEffect } from "react";

import Balance from "@/components/home/Balance";
import AccountSwitcher from "@/components/home/AccountSwitcher";
import TransactionList from "@/components/home/TransactionList";
import type { Transaction } from "@/models/Transaction";
import { useAccounts } from "@/api/hooks/useAccounts";

interface HomeViewProps {
  onTransactionClick?: (transaction: Transaction) => void;
}

export default function HomeView({ onTransactionClick }: HomeViewProps) {
  const { accounts } = useAccounts();
  
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(null);

  useEffect(() => {
    // Only initialize if not already selected
    if (selectedAccountId !== null) return;

    // Assign the accountId to filter transactions later
    if (!accounts.isPending && !accounts.isError && accounts.data) {
      const savedId = localStorage.getItem("defaultAccount");
      
      if (savedId) {
        const found = accounts.data.find(a => a.accountId === Number(savedId));
        if (found) {
          setSelectedAccountId(found.accountId!);
          return;
        }
      }
      if (accounts.data.length > 0) {
        setSelectedAccountId(accounts.data[0].accountId!);
      }
    }    
  }, [accounts.data, accounts.isPending, accounts.isError, selectedAccountId]);

  return (
    <div className="m-5">
      <AccountSwitcher
        onAccountChange={setSelectedAccountId}
        selectedAccountId={selectedAccountId} />

      {selectedAccountId && <Balance selectedAccountId={selectedAccountId} />}

      <TransactionList
        selectedAccountId={selectedAccountId}
        onTransactionClick={onTransactionClick} />
    </div>
  )
}