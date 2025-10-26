import { createRouter, RouterProvider } from '@tanstack/react-router';
import { routeTree } from "./routeTree.gen";
import { ThemeProvider } from '@/components/theme-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useClerkAuth } from '@/features/auth/clerk';

const queryClient = new QueryClient();

// Create a new router instance
const router = createRouter({
  routeTree,
  scrollRestoration: true,
  context: {
    queryClient,
  },
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export const App = () => {
  const auth = useClerkAuth();

  if (auth.isLoading) {
    return null;
  }

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <QueryClientProvider client={queryClient}>
        {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
        <RouterProvider router={router} context={{auth}} />
        </QueryClientProvider>
    </ThemeProvider>
  );
};
