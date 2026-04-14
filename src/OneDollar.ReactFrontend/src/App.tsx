import { Routes, Route } from 'react-router'

import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'
import Statistics from './pages/Statistics'
import ProfileSettings from './pages/ProfileSettings'
import NotFound from './pages/NotFound'

function App() {

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path='stats' element={<Statistics />} />
        <Route path='settings' element={<ProfileSettings />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App