import api from "./api";

export interface File201 {
  id: string;
  accountId: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  category?: string | null;
  description?: string | null;
  uploadedBy?: string | null;
  uploadedAt: Date;
  account?: {
    id: string;
    email: string;
    role: string;
    employeeProfile?: {
      firstName: string | null;
      lastName: string | null;
    };
    teacherProfile?: {
      teacherData?: {
        firstName: string | null;
        lastName: string | null;
      };
    };
  };
  fileCategory?: FileCategory;
}


export interface File201Stats {
  totalFiles: number;
  totalSize: number;
  categories: Record<string, number>;
}

export interface FileCategory {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export const files201Api = {
  getCategories: async (): Promise<FileCategory[]> => {
    const response = await api.get("/files201/categories");
    return response.data;
  },

  createCategory: async (data: { name: string; description?: string }): Promise<FileCategory> => {
    const response = await api.post("/files201/categories", data);
    return response.data;
  },

  deleteCategory: async (id: string): Promise<void> => {
    await api.delete(`/files201/categories/${id}`);
  },

  upload: async (
    file: File,
    category?: string,
    description?: string,
    accountId?: string,
    categoryId?: string,
  ): Promise<File201> => {
    const formData = new FormData();
    formData.append("file", file);
    if (category) formData.append("category", category);
    if (categoryId) formData.append("categoryId", categoryId);
    if (description) formData.append("description", description);
    if (accountId) formData.append("accountId", accountId);

    const response = await api.post("/files201/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  getAll: async (): Promise<File201[]> => {
    const response = await api.get("/files201");
    return response.data;
  },

  getMyFiles: async (): Promise<File201[]> => {
    const response = await api.get("/files201/my-files");
    return response.data;
  },

  getByAccount: async (accountId: string): Promise<File201[]> => {
    const response = await api.get(`/files201/account/${accountId}`);
    return response.data;
  },

  getOne: async (id: string): Promise<File201> => {
    const response = await api.get(`/files201/${id}`);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/files201/${id}`);
  },

  getStats: async (): Promise<File201Stats> => {
    const response = await api.get("/files201/stats");
    return response.data;
  },
};
