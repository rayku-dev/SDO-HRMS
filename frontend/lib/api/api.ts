import axios, { AxiosError } from "axios";
import { AuthResponse } from "../../@types/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// Mutex to prevent multiple refresh calls
let refreshPromise: Promise<boolean> | null = null;

async function refreshAccessToken(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        await api.post<AuthResponse>("/auth/refresh");
        return true;
      } catch {
        return false;
      } finally {
        refreshPromise = null;
      }
    })();
  }
  return refreshPromise;
}

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;
    
    // If we get a 401, try to refresh the token via cookies
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const success = await refreshAccessToken();
      if (success) {
        // Cookies are automatic, just retry the request
        return api(originalRequest);
      } else {
        // If refresh fails, we might want to redirect to login
        if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
           window.location.href = `/login?from=${window.location.pathname}`;
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
