import { StrictMode } from 'react'
import { Provider } from '@/components/ui/provider.tsx';
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppContextProvider from './context/app-context.tsx';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider>
        <AppContextProvider>
          <App />
        </AppContextProvider>
      </Provider>
    </QueryClientProvider>
  </StrictMode>,
)
