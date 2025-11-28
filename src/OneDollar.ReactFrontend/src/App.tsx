import { useState } from 'react'

import HomeView from './views/HomeView'
import AddTransactionView from './views/AddTransactionView'
import ProfileSettings from './views/ProfileSettingsView'
import BottomBar from './components/shared/nav/BottomBar'
import type { Transaction } from "@/models/Transaction"

function App() {
  const [showHome, setShowHome] = useState(true);
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
      {showHome == true 
        ? <HomeView onTransactionClick={handleTransactionClick} />
        : <ProfileSettings />
      }

      <BottomBar onAddClick={handleAddClick} onShowHome={setShowHome} />

      {/* Add transaction drawer */}
      <AddTransactionView 
        isOpen={addTransactionDrawerState} 
        onOpenChange={setAddTransactionDrawerState}
        transaction={selectedTransaction} />
    </>
  )
}

export default App
