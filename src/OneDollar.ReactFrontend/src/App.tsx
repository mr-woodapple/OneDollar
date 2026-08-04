import { Routes, Route } from 'react-router'

import Home from './pages/Home'
import NotFound from './pages/NotFound'
import Statistics from './pages/Statistics'
import ProfileSettings from './pages/ProfileSettings'
import MainLayout from './layouts/MainLayout'

export default function App() {

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
