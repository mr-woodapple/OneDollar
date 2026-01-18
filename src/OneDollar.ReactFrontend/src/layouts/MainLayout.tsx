import { useState } from 'react';
import { Outlet } from 'react-router';

import type { Transaction } from '@/models/Transaction';
import BottomBar from '@/components/shared/nav/BottomBar';
import AddTransaction from '@/components/transactions/addTransaction/AddTransaction';

export default function MainLayout() {
  const [addTransactionDrawerState, setAddTransactionDrawerState] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | undefined>(undefined);

  const handleTransactionClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setAddTransactionDrawerState(true);
  };

  const handleAddClick = () => {
    setSelectedTransaction(undefined);
    setAddTransactionDrawerState(true);
  };

  return (
    <div className="flex flex-col h-dvh overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <Outlet context={{ onTransactionClick: handleTransactionClick }} />
      </div>

      <BottomBar onAddClick={handleAddClick} />
      <AddTransaction
        isOpen={addTransactionDrawerState}
        onOpenChange={setAddTransactionDrawerState}
        transaction={selectedTransaction} />
    </div>
  )
}