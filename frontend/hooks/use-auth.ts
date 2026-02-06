"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import { getCurrentUser, logout } from "@/lib/api/auth";
import { AuthError, type User } from "@/@types/auth";
import { usePathname } from "next/navigation";

export function useAuth(
  options: { required?: boolean; redirectTo?: string } = {},
) {
  const pathname = usePathname();
  const router = useRouter();
  const [serverDown, setServerDown] = useState(false);

  const {
    data: user,
    error,
    isLoading,
    mutate,
  } = useSWR<User | null>("/auth/me", getCurrentUser, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });

  const retryAuth = () => {
    setServerDown(false); // clear meltdown flag
    mutate(); // re-fetch /auth/me
  };

  useEffect(() => {
    if (!isLoading && !error && !pathname.startsWith("/error")) {
      // Only update if server is reachable
      sessionStorage.setItem("lastGoodRoute", pathname);
    }
  }, [pathname, isLoading, error]);

  useEffect(() => {
    if (!isLoading && error instanceof AuthError && error.status === 500) {
      if (!serverDown) {
        setServerDown(true);
        router.push("/error/500");
      }
    } else if (!isLoading && !user && options.required) {
      router.push(options.redirectTo || "/login");
    }
  }, [
    isLoading,
    error,
    user,
    options.required,
    options.redirectTo,
    router,
    serverDown,
  ]);

  useEffect(() => {
    if (!isLoading && !user && options.required) {
      router.push(options.redirectTo || "/login");
    }
  }, [user, isLoading, options.required, options.redirectTo, router]);

  const handleLogout = async () => {
    await logout();
    mutate(null, false);
    router.push("/");
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    error,
    logout: handleLogout,
    mutate,
    retryAuth,
  };
}
