import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/sidebar/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { Separator } from "@/components/ui/separator";
import AppBreadcrumbs from "@/components/app-breadcrumbs";

export const Route = createFileRoute("/_layout")({
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAuthenticated && !context.auth.isLoading) {
      throw redirect({
        to: "/auth/sign-in",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: Layout,
});

function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <AppBreadcrumbs />
          </div>
        </header>
        <div className="p-4 pt-0">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
