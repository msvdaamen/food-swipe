import { StrictMode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/components/theme-provider';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

type AppProviderProps = {
    children: React.ReactNode;
  };

const queryClient = new QueryClient();

export function AppProvider({ children }: AppProviderProps) {
    return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <QueryClientProvider client={queryClient}>
        {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
        {children}
        </QueryClientProvider>
    </ThemeProvider>
    )
}