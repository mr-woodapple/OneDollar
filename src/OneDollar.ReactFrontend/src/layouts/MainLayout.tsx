import { useState } from 'react';
import { Outlet } from 'react-router';
import { useMediaQuery } from '@/hooks/useMediaQuery';

import type { Transaction } from '@/models/Transaction';
import BottomBar from '@/components/shared/nav/BottomBar';
import AddTransaction from '@/components/transactions/AddTransaction';
import Sidebar from '@/components/shared/nav/Sidebar';

export default function MainLayout() {
  const isDesktop = useMediaQuery("(min-width: 768px)");
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
    <div className="bg-background overflow-hidden">
      {isDesktop ? (
        <div className="flex flex-row h-dvh">
          <Sidebar onAddClick={handleAddClick} />
          
          <div className="flex-1 max-w-screen-sm mx-auto w-full overflow-y-auto">
            <Outlet context={{ onTransactionClick: handleTransactionClick }} />
          </div>
        </div>
      ) : (
        <div className="flex h-dvh flex-col">
          <div className="flex-1 overflow-y-auto">
            <Outlet context={{ onTransactionClick: handleTransactionClick }} />
          </div>

          <BottomBar onAddClick={handleAddClick} />
        </div>
      )}

      <AddTransaction
        isOpen={addTransactionDrawerState}
        onOpenChange={setAddTransactionDrawerState}
        transaction={selectedTransaction} />
    </div>
  )
}
