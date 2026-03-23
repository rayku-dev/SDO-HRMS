export type Role =
  | "ADMIN"
  | "APPROVING_AUTHORITY"
  | "EMPLOYEE"
  | "HR_ASSOCIATE"
  | "HR_HEAD"
  | "UNIT_HEAD"
  | "SCHOOL_PERSONNEL";

export interface User {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  role: Role;
  isActive: boolean;
  employeeNumber?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export class AuthError extends Error {
  constructor(
    message: string,
    public status?: number,
  ) {
    super(message);
    this.name = "AuthError";
  }
}
