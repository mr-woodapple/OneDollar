import { useState } from 'react'
import HomeView from './views/HomeView'
import BottomBar from './components/shared/nav/BottomBar'
import AddTransactionView from './views/AddTransactionView'
import ProfileSettings from './views/ProfileSettingsView'
import { useTransactions } from './hooks/useTransactions'
import type { Transaction } from "@/models/Transaction"

function App() {
  const [showHome, setShowHome] = useState(true);
  const [addTransactionDrawerState, setAddTransactionDrawerState] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | undefined>(undefined);

  const { transactions, fetching, loading, error, addTransaction, updateTransaction, deleteTransaction } = useTransactions();

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
      {showHome == true 
        ? <HomeView 
            transactions={transactions} 
            fetching={fetching} 
            error={error} 
            onTransactionClick={handleTransactionClick} />
        : <ProfileSettings />
      }

      <BottomBar onAddClick={handleAddClick} onShowHome={setShowHome} />

      {/* Add transaction drawer */}
      <AddTransactionView 
        isOpen={addTransactionDrawerState} 
        onOpenChange={setAddTransactionDrawerState}
        addTransaction={addTransaction}
        updateTransaction={updateTransaction}
        loading={loading}
        error={error}
        transaction={selectedTransaction} 
        deleteTransaction={deleteTransaction} />
    </>
  )
}

export default App
