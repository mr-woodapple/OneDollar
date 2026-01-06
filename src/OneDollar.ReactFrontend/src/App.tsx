import { Routes, Route } from 'react-router'

import TransactionsPage from './pages/TransactionsPage'
import ProfileSettingsPage from './pages/ProfileSettingsPage'
import MainLayout from './layouts/MainLayout'
import PageNotFound from './pages/PageNotFound'

function App() {

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index path='/' element={<TransactionsPage />} />
        <Route path='settings' element={<ProfileSettingsPage />} />
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  )
}

export default App