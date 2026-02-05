"use client";

import {
  BookOpen,
  BriefcaseBusiness,
  Frame,
  HandCoins,
  LayoutDashboard,
  Map,
  PieChart,
  Settings2,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { SiNintendogamecube } from "react-icons/si";
import { SiRockstargames } from "react-icons/si";
import { TeamSwitcher } from "./team-switcher";
import { SiRiotgames } from "react-icons/si";
import { NavProjects } from "./nav-projects";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import * as React from "react";

// This is sample data.
const data = {
  teams: [
    {
      name: "Riot Games",
      logo: SiRiotgames,
      plan: "Enterprise",
    },
    {
      name: "Rock Star",
      logo: SiRockstargames,
      plan: "Startup",
    },
    {
      name: "Nintendo",
      logo: SiNintendogamecube,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Home",
      url: "/home",
      icon: LayoutDashboard,
      isActive: true,
      items: [
        {
          title: "Dashboard",
          url: "/home/dashboard",
        },
        {
          title: "Daily Time Record",
          url: "/home/dtr",
        },
      ],
    },
    {
      title: "Sales",
      url: "/sales",
      icon: HandCoins,
      items: [
        {
          title: "Overview",
          url: "/sales/overview",
        },
        {
          title: "Invoice",
          url: "/sales/invoice",
        },
      ],
    },
    {
      title: "Forms",
      url: "/forms",
      icon: BookOpen,
      items: [
        {
          title: "OT Form",
          url: "/forms/ot-form",
        },
        {
          title: "Leave Form",
          url: "/forms/leave-form",
        },
      ],
    },
    {
      title: "Management",
      url: "/management",
      icon: BriefcaseBusiness,
      items: [
        {
          title: "Inventory",
          url: "/management/inventory",
        },
        {
          title: "Approvals",
          url: "/management/approvals",
        },
      ],
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings2,
      items: [
        {
          title: "System",
          url: "/settings/system",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "/design-engineering",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "/sales-marketing",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "/travel",
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      className="select-none text-sidebar-text"
      id="sidebar"
      variant="floating"
      collapsible="icon"
      {...props}
    >
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
