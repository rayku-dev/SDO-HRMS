export type Role = "ADMIN" | "HR" | "EMPLOYEE" | "TEACHER" | "REGULAR";

export interface User {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  role: Role;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export class AuthError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = "AuthError";
  }
}
