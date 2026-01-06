import { useState } from 'react';
import { Outlet } from 'react-router';

import type { Transaction } from '@/models/Transaction';
import BottomBar from '@/components/shared/nav/BottomBar';
import AddTransaction from '@/components/transaction/AddTransaction';

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
    <>
      <Outlet context={{ onTransactionClick: handleTransactionClick }} />

      <BottomBar onAddClick={handleAddClick} />
      <AddTransaction 
        isOpen={addTransactionDrawerState} 
        onOpenChange={setAddTransactionDrawerState}
        transaction={selectedTransaction} />
    </>
  )
}