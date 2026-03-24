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
    <SidebarProvider className="flex min-h-svh bg-background transition-all duration-500">
      <AppSidebar />
      <SidebarInset className="relative overflow-hidden bg-background">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-transparent pointer-events-none" />
        <Header />
        <main className="flex-1 overflow-y-auto px-4 py-8 md:px-8 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-2 duration-700">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
