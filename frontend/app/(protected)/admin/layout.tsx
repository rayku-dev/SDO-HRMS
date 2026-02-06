"use client";

import type React from "react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth({ required: true, redirectTo: "/login" });
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user && !["ADMIN", "HR"].includes(user.role)) {
      router.push("/error/403");
    }
  }, [user, isLoading, router]);

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

  if (user && !["ADMIN", "HR"].includes(user.role)) {
    return null;
  }

  // Admin layout just acts as a guard - parent layout handles navigation
  return <>{children}</>;
}
