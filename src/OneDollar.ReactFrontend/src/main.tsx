import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { Toaster } from './components/ui/sonner.tsx'


import './index.css'
import App from './App.tsx'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <Toaster position='top-center' />

      <ReactQueryDevtools initialIsOpen={false} buttonPosition='top-right' />
    </QueryClientProvider>
  </StrictMode>,
)
