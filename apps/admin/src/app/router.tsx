import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

// Create a new router instance
export const router = createRouter({
    routeTree,
    scrollRestoration: true,
    context: () => ({ test: "appel" }),
  });

  // Register the router instance for type safety
  declare module "@tanstack/react-router" {
    interface Register {
      router: typeof router;
    }
  }

export function AppRouter() {
  return (
      <RouterProvider router={router} />
  );
}
