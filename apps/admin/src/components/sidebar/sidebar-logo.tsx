import { SidebarMenu } from "../ui/sidebar";

import { SidebarMenuButton } from "../ui/sidebar";

import { GalleryVerticalEnd } from "lucide-react";
import { SidebarMenuItem } from "../ui/sidebar";

export default function SidebarLogo() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" asChild>
          <a href="#">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-emerald-500 text-sidebar-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
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
