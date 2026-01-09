import { Routes, Route } from 'react-router'

import TransactionsPage from './pages/TransactionsPage'
import ProfileSettingsPage from './pages/ProfileSettingsPage'
import MainLayout from './layouts/MainLayout'
import PageNotFound from './pages/PageNotFound'
import StatisticsPage from './pages/StatisticsPage'

function App() {

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index path='/' element={<TransactionsPage />} />
        <Route index path='stats' element={<StatisticsPage />} />
        <Route path='settings' element={<ProfileSettingsPage />} />
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  )
}

export default App