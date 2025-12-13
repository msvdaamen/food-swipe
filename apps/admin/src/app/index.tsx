import { AppRouter } from './router';
import { AppProvider } from './provider';
import { Toaster } from '@/components/ui/sonner';

export const App = () => {
  return (
    <AppProvider>
      <Toaster/>
      <AppRouter />
    </AppProvider>
  );
};
