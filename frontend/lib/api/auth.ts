import api from "./api";
import { AuthResponse, User, AuthError } from "../../@types/auth";

export async function login(
  email: string,
  password: string
): Promise<AuthResponse> {
  try {
    const res = await api.post<AuthResponse>("/auth/login", {
      email,
      password,
    });
    return res.data;
  } catch (err: any) {
    throw new AuthError(
      err.response?.data?.message || "Login failed",
      err.response?.status
    );
  }
}

export async function register(
  email: string,
  password: string,
  firstName?: string,
  lastName?: string
): Promise<User> {
  try {
    const res = await api.post<User>("/auth/register", {
      email,
      password,
      firstName,
      lastName,
    });
    return res.data;
  } catch (err: any) {
    throw new AuthError(
      err.response?.data?.message || "Registration failed",
      err.response?.status
    );
  }
}

export async function logout(): Promise<void> {
  try {
    await api.post("/auth/logout");
  } catch (err) {
    console.error("Logout API failed", err);
  } finally {
    // Rely on cookies being cleared by the backend
    // and possible local state clearing here if needed
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const res = await api.get<{ user: User }>("/auth/me");
    return res.data.user;
  } catch (err: any) {
    throw new AuthError(
      err.response?.data?.message || "Unable to fetch user",
      err.response?.status || 500
    );
  }
}

