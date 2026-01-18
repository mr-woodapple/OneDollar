import { useState, useEffect } from "react";
import { useOutletContext } from "react-router";

import Balance from "@/components/transactions/Balance";
import AccountSwitcher from "@/components/transactions/AccountSwitcher";
import TransactionList from "@/components/transactions/TransactionList";
import type { Transaction } from "@/models/Transaction";
import { useAccounts } from "@/api/hooks/useAccounts";

interface TransactionContext {
  onTransactionClick: (transaction: Transaction) => void;
}

export default function HomeView() {
  const { onTransactionClick } = useOutletContext<TransactionContext>();
  const { accounts } = useAccounts();
  
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(() => {
    const savedId = localStorage.getItem("defaultAccount");
    return savedId ? Number(savedId) : null;
  });

  useEffect(() => {
    if (accounts.isPending || accounts.isError || !accounts.data) return;

    // Check if current selection is valid
    if (selectedAccountId !== null) {
      const found = accounts.data.find(a => a.accountId === selectedAccountId);
      if (!found) {
        // Validation failed, reset to default
        if (accounts.data.length > 0) {
          const defaultId = accounts.data[0].accountId!;
          setSelectedAccountId(defaultId);
          localStorage.setItem("defaultAccount", defaultId.toString());
        } else {
          setSelectedAccountId(null);
        }
      }
    } else {
      // No selection, select first available
      if (accounts.data.length > 0) {
        const defaultId = accounts.data[0].accountId!;
        setSelectedAccountId(defaultId);
        localStorage.setItem("defaultAccount", defaultId.toString());
      }
    }
  }, [accounts.data, accounts.isPending, accounts.isError, selectedAccountId]);

  const handleAccountChange = (id: number) => {
    setSelectedAccountId(id);
    localStorage.setItem("defaultAccount", id.toString());
  };

  return (
    <div className="m-5">
      <AccountSwitcher
        onAccountChange={handleAccountChange}
        selectedAccountId={selectedAccountId} />

      {selectedAccountId && <Balance selectedAccountId={selectedAccountId} />}

      <TransactionList
        selectedAccountId={selectedAccountId}
        onTransactionClick={onTransactionClick} />
    </div>
  )
}