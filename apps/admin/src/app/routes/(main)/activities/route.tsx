import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/(main)/activities")({
  component: RouteComponent,
  context: () => ({ breadcrumb: "Activities" }),
});

function RouteComponent() {
  return <Outlet />;
}
