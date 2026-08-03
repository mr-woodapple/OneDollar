import { useState } from 'react';
import { Outlet } from 'react-router';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useApiHealth } from '@/api/hooks/useApiHealth';

import type { Transaction } from '@/models/Transaction';
import BottomBar from '@/components/shared/nav/BottomBar';
import AddTransaction from '@/components/transactions/AddTransaction';
import Sidebar from '@/components/shared/nav/Sidebar';
import ApiUnavailableOverlay from '@/components/shared/alerts/ApiUnavailableOverlay';

export default function MainLayout() {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { isApiUnavailable } = useApiHealth();
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
    <div className="h-dvh bg-background overflow-hidden">
      <ApiUnavailableOverlay isOpen={isApiUnavailable} />

      <div inert={isApiUnavailable} className="h-full">
        {isDesktop ? (
          <div className="flex h-full flex-row">
            <Sidebar onAddClick={handleAddClick} />

            <div className="flex-1 max-w-screen-sm mx-auto w-full overflow-y-auto">
              <Outlet context={{ onTransactionClick: handleTransactionClick }} />
            </div>
          </div>
        ) : (
          <div className="flex h-full flex-col">
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
    </div>
  )
}
