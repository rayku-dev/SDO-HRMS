"use client";

import useSWR from "swr";
import api from "@/lib/api/api"; // import the axios instance
import type { User } from "@/@types/auth";
import { useAuth } from "./use-auth";

async function fetchUsers(): Promise<User[]> {
  try {
    const res = await api.get<User[]>("/users");
    return res.data; // Axios already parses JSON
  } catch (error) {
    // Don't throw error, just return empty array for non-admin users
    return [];
  }
}

export function useUsers() {
  const { user } = useAuth();
  // Only fetch users if user is admin
  const shouldFetch = user?.role === "ADMIN";
  
  const { data, error, isLoading, mutate } = useSWR<User[]>(
    shouldFetch ? "/users" : null, // Pass null to disable fetching for non-admins
    fetchUsers,
    {
      onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
        // Don't retry on 403 errors
        if (error?.response?.status === 403) return;
        // Retry up to 3 times for other errors
        if (retryCount >= 3) return;
        setTimeout(() => revalidate({ retryCount }), 5000);
      },
    }
  );

  return {
    users: shouldFetch ? data : undefined,
    isLoading: shouldFetch ? isLoading : false,
    error: shouldFetch ? error : null,
    mutate,
  };
}
