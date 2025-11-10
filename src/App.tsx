import { useState } from 'react'
import Home from './views/HomeView'
import BottomBar from './components/shared/nav/BottomBar'
import AddTransaction from './views/AddTransactionView'
import ProfileSettings from './views/ProfileSettingsView'

function App() {
  const [addTransactionDrawerState, setAddTransactionDrawerState] = useState(false)
  const [showHome, setShowHome] = useState(true);

  return (
    <>
      {showHome == true 
        ? <Home />
        : <ProfileSettings />
      }

      <AddTransaction isOpen={addTransactionDrawerState} onOpenChange={setAddTransactionDrawerState} />
      <BottomBar onAddClick={() => setAddTransactionDrawerState(true)} onShowHome={setShowHome} />
    </>
  )
}

export default App
