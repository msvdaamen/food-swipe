import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/activities")({
  component: RouteComponent,
  context: () => ({ breadcrumb: "Activities" }),
});

function RouteComponent() {
  return <Outlet />;
}
