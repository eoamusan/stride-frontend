import { create } from 'zustand';
import JobRequisitionService from '@/api/jobRequisition';

export const useJobRequisitionStore = create((set, get) => ({
  requisitions: [],
  isLoading: false,
  pagination: {
    page: 1,
    totalPages: 1,
    totalDocs: 0,
    limit: 10,
  },

  fetchRequisitions: async (page = 1) => {
    try {
      set({ isLoading: true });
      const response = await JobRequisitionService.fetch({ page, perPage: 10 });
      if (response.data && response.data.data) {
        set({
          requisitions: response.data.data.jobRequisitions || [],
          pagination: {
            page: response.data.data.page,
            totalPages: response.data.data.totalPages,
            totalDocs: response.data.data.totalDocs,
            limit: response.data.data.limit,
          },
        });
      }
    } catch (error) {
      console.error('Error fetching requisitions:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  createRequisition: async (data) => {
    try {
      set({ isLoading: true });
      const response = await JobRequisitionService.create(data);
      // Refresh the list after successful creation
      await get().fetchRequisitions(1);
      return response;
    } catch (error) {
      console.error('Error creating requisition:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));
