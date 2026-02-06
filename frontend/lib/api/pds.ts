import api from "./api";

export interface PdsData {
  userId: string;
  personalData: Record<string, any>;
  familyData: Record<string, any>;
  educationalData: Record<string, any>;
  civilServiceData?: Record<string, any>;
  workExperienceData?: Record<string, any>;
  voluntaryWorkData?: Record<string, any>;
  trainingProgramsData?: Record<string, any>;
  otherInfo?: Record<string, any>;
  lastpData?: Record<string, any>;
  status?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePdsDto extends PdsData {}

export const pdsApi = {
  // Create or update PDS
  upsert: async (data: CreatePdsDto) => {
    const response = await api.post("/pds/upsert", data);
    return response.data;
  },

  // Get PDS by userId
  getByUserId: async (userId: string) => {
    try {
      const response = await api.get(`/pds/${userId}`);
      return response.data;
    } catch (error: any) {
      // 404 is expected when PDS doesn't exist yet - return null instead of throwing
      if (error.response?.status === 404) {
        return null;
      }
      // Re-throw other errors
      throw error;
    }
  },

  // Get all PDS (admin only)
  getAll: async () => {
    const response = await api.get("/pds");
    return response.data;
  },

  // Generate PDF
  generatePdf: async (pdsData: Record<string, any>) => {
    // Create a new axios config for blob response to avoid header conflicts
    const response = await api.post(
      "/pds/generate-pdf",
      { pdsData },
      {
        responseType: "blob",
        headers: {
          "Content-Type": "application/json",
        },
        transformRequest: [(data) => JSON.stringify(data)],
      }
    );
    return response.data;
  },

  // Delete PDS
  delete: async (userId: string) => {
    const response = await api.delete(`/pds/${userId}`);
    return response.data;
  },
};
