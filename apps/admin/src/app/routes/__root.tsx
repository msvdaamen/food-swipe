import { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

interface Context {
  queryClient: QueryClient;
  auth: {
    isAuthenticated: boolean;
    isLoading: boolean;
  };
}

export const Route = createRootRouteWithContext<Context>()({
  component: () => (
    <>
      <Outlet />
      {import.meta.env.DEV && <TanStackRouterDevtools />}
    </>
  ),
});
