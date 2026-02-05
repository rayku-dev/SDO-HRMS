"use client";

import type React from "react";
import { useAuth } from "@/hooks/use-auth";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/header/header";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading } = useAuth({ required: true, redirectTo: "/login" });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-theme min-h-screen font-sans" style={{ fontFamily: "var(--font-sans)" }}>
      <div className="dashboard-wrapper min-h-screen bg-background/50">
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset className="bg-transparent">
            <Header />
            <div className="flex flex-1 flex-col gap-6 p-6">
              {children}
            </div>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </div>
  );
}
