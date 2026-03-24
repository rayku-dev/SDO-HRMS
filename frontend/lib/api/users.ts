import api from "./api";
import type { User } from "@/@types/auth";

export interface CreateUserData {
  email: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  nameExtension?: string;
  role?: string;
  isActive?: boolean;
  designation?: string;
  appointmentDate?: string;
  schedule?: string;
  appointment?: string;
  jobTitle?: string;
  unit?: string;
  supervisor?: string;
  hrHead?: string;
  approver?: string;
  employeeNumber?: string;
}

export const usersApi = {
  getAll: async (): Promise<User[]> => {
    const response = await api.get("/users");
    return response.data;
  },

  getById: async (id: string): Promise<User> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  create: async (data: CreateUserData): Promise<User> => {
    const response = await api.post("/users", data);
    return response.data;
  },

  import: async (file: File): Promise<any> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post("/users/import", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  update: async (id: string, data: Partial<CreateUserData>): Promise<User> => {
    const response = await api.patch(`/users/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
  
  resendInvite: async (id: string): Promise<{ message: string; temporaryPassword: string }> => {
    const response = await api.post(`/users/${id}/resend-invite`);
    return response.data;
  },
};
