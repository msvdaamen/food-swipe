import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/common/components/ui/sidebar";

import { User, Utensils, Egg, Ruler, Activity, Library } from "lucide-react";
import SidebarLogo from "./sidebar-logo";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";

// This is sample data.
const data = {
  user: {
    name: "Mischa Daamen",
    email: "msv.daamen@outlook.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Activity",
      url: "#",
      icon: Activity,
      isActive: true,
      items: [
        {
          title: "Logins",
          url: "/activities/login-activity",
          icon: User,
        },
        {
          title: "Recipes",
          url: "/activities/recipes-uploaded",
          icon: Utensils,
        },
      ],
    },
    {
      title: "Recipes",
      url: "#",
      icon: Library,
      items: [
        {
          title: "Recipes",
          url: "/recipes/recipes",
          icon: Utensils,
        },
        {
          title: "Ingredients",
          url: "/recipes/ingredients",
          icon: Egg,
        },
        {
          title: "Measurements",
          url: "/recipes/measurements",
          icon: Ruler,
        },
      ],
    },
  ],
};

export default function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarLogo />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
