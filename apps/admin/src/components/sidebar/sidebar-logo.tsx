import { SidebarMenu } from "../ui/sidebar";

import { SidebarMenuButton } from "../ui/sidebar";

import { SidebarMenuItem } from "../ui/sidebar";

export default function SidebarLogo() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" asChild>
          <a href="#">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground">
              <img src="/images/logo.png" alt="Food-swipe Logo" className="size-8" />
            </div>
            <div className="flex flex-col gap-0.5 leading-none">
              <span className="font-semibold">Food-swipe</span>
            </div>
          </a>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
