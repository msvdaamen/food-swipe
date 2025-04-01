import { SidebarInset, SidebarTrigger } from "@/common/components/ui/sidebar";
import AppSidebar from "@/common/components/sidebar/app-sidebar";
import { SidebarProvider } from "@/common/components/ui/sidebar";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Separator } from "@/common/components/ui/separator";
import AppBreadcrumbs from "@/common/components/app-breadcrumbs";

export const Route = createFileRoute("/_layout")({
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
