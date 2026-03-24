"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { 
  LogOut, 
  LayoutDashboard, 
  FileText, 
  FolderOpen, 
  Users, 
  Library, 
  Home, 
  Settings,
  ChevronRight
} from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!user) return null;

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }
  };

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  // Common items for all users
  const commonItems = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "My PDS",
      url: "/pds",
      icon: FileText,
    },
    {
      title: "201 Files",
      url: "/files201",
      icon: FolderOpen,
    },
  ];

  // Admin/HR-only items
  const adminItems = [
    {
      title: "PDS Management",
      url: "/admin/pds",
      icon: FileText,
      roles: ["ADMIN", "HR_ASSOCIATE", "HR_HEAD"],
    },
    {
      title: "201 Management",
      url: "/admin/files201",
      icon: Library,
      roles: ["ADMIN", "HR_ASSOCIATE", "HR_HEAD"],
    },
    {
      title: "File Categories",
      url: "/admin/files201/categories",
      icon: Library,
      roles: ["ADMIN", "HR_ASSOCIATE", "HR_HEAD"],
    },
    {
      title: "User Management",
      url: "/admin/users",
      icon: Users,
      roles: ["ADMIN"],
    },
  ];

  const filteredAdminItems = adminItems.filter(
    (item) => !item.roles || item.roles.includes(user.role)
  );

  return (
    <Sidebar
      variant="floating"
      collapsible="icon"
      {...props}
      className="border-r border-border bg-background backdrop-blur-xl"
    >
      <SidebarHeader className="h-20 flex justify-center border-b border-border/50 px-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              className="hover:bg-transparent"
            >
              <Link href="/dashboard" className="flex items-center gap-3">
                <div className="flex aspect-square size-10 items-center justify-center rounded-xl bg-card border border-border shadow-sm group-data-[collapsible=icon]:size-8 transition-all">
                  <Library className="size-5 text-primary" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none transition-all group-data-[collapsible=icon]:hidden">
                  <span className="font-black text-xl text-foreground tracking-tighter uppercase leading-none">
                    SDO<span className="text-primary italic">-HRMS</span>
                  </span>
                  <span className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-[0.2em] mt-1">
                    Enterprise Portal
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="pt-6">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 transition-all group-data-[collapsible=icon]:hidden uppercase text-[9px] font-black tracking-[0.3em] text-muted-foreground/50 mb-3">
            Main Features
          </SidebarGroupLabel>
          <SidebarMenu className="gap-2">
            {commonItems.map((item) => {
              const active = isActive(item.url);
              return (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    isActive={active}
                    tooltip={item.title}
                    className={cn(
                      "h-12 rounded-2xl transition-all px-4",
                      active
                        ? "bg-foreground text-background font-black shadow-lg shadow-black/5"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                    )}
                  >
                    <Link href={item.url} className="flex items-center gap-3">
                      <item.icon
                        className={cn(
                          "size-5",
                          active ? "text-primary" : "text-muted-foreground",
                        )}
                      />
                      <span className="group-data-[collapsible=icon]:hidden text-xs font-black uppercase tracking-widest">
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>

        {filteredAdminItems.length > 0 && (
          <SidebarGroup className="mt-4">
            <SidebarGroupLabel className="px-4 transition-all group-data-[collapsible=icon]:hidden uppercase text-[9px] font-black tracking-[0.3em] text-muted-foreground/50 mb-3">
              Administration
            </SidebarGroupLabel>
            <SidebarMenu className="gap-2">
              {filteredAdminItems.map((item) => {
                const active = isActive(item.url);
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      tooltip={item.title}
                      className={cn(
                        "h-12 rounded-2xl transition-all px-4",
                        active
                          ? "bg-foreground text-background font-black shadow-lg shadow-black/5"
                          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                      )}
                    >
                      <Link href={item.url} className="flex items-center gap-3">
                        <item.icon
                          className={cn(
                            "size-5",
                            active ? "text-primary" : "text-muted-foreground",
                          )}
                        />
                        <span className="group-data-[collapsible=icon]:hidden text-xs font-black uppercase tracking-widest">
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-border/50 p-2 space-y-4">
        <SidebarMenu>
          <SidebarMenuItem className="group-data-[collapsible=icon]:hidden bg-muted/50 p-3 rounded-2xl border border-border/30">
            <div className="flex items-center justify-between gap-2 px-1">
              <div className="relative h-4 flex-1 text-muted-foreground pointer-events-none">
                <span
                  className={cn(
                    "absolute inset-0 text-[10px] uppercase tracking-[0.2em] font-black transition-all duration-500 flex items-center",
                    mounted && resolvedTheme === "dark"
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 -translate-y-2 text-muted-foreground/60",
                  )}
                >
                  Dark Mode
                </span>
                <span
                  className={cn(
                    "absolute inset-0 text-[10px] uppercase tracking-[0.2em] font-black transition-all duration-500 flex items-center",
                    mounted && resolvedTheme !== "dark"
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-2 text-muted-foreground/60",
                  )}
                >
                  Light Mode
                </span>
              </div>
              <ThemeToggle />
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem className="mt-2">
            <SidebarMenuButton
              onClick={handleLogout}
              disabled={loading}
              tooltip="Logout"
              className="h-12 w-full justify-start text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 rounded-2xl gap-3 transition-all px-4 font-black text-xs uppercase tracking-widest active:scale-95"
            >
              <LogOut className="size-5" />
              <span className="group-data-[collapsible=icon]:hidden">
                {loading ? "Secure Exit..." : "Sign Out"}
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
