import { create } from 'zustand';
import JobPostService from '@/api/postNewJob';

export const useJobPostStore = create((set, get) => ({
  jobPostings: [],
  isLoading: false,
  pagination: {
    page: 1,
    totalPages: 1,
    totalDocs: 0,
    limit: 10,
  },

  fetchJobPostings: async (page = 1, limit = 10, search = '') => {
    try {
      set({ isLoading: true });
      const response = await JobPostService.fetch({ page, perPage: limit, search });
      if (response.data && response.data.data) {
        set({
          jobPostings: response.data.data.jobs || [],
          pagination: {
            page: response.data.data.page,
            totalPages: response.data.data.totalPages,
            totalDocs: response.data.data.totalDocs,
            limit: response.data.data.limit,
          },
        });
      }
    } catch (error) {
      console.error('Error fetching job postings:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  createJobPosting: async (data) => {
    try {
      set({ isLoading: true });
      const response = await JobPostService.create(data);
      // Refresh the list after successful creation
      const { pagination } = get();
      await get().fetchJobPostings(1, pagination.limit);
      return response;
    } catch (error) {
      console.error('Error creating job posting:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateJobPosting: async ({ id, data }) => {
    try {
      set({ isLoading: true });
      const response = await JobPostService.update({ id, data });
      // Refresh the list after successful update
      const { pagination } = get();
      await get().fetchJobPostings(pagination.page, pagination.limit);
      return response;
    } catch (error) {
      console.error('Error updating job posting:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateJobStatus: async ({ id, status }) => {
    try {
      set({ isLoading: true });
      const response = await JobPostService.updateStatus({ id, status });
      // Refresh the list after successful update
      const { pagination } = get();
      await get().fetchJobPostings(pagination.page, pagination.limit);

      // Also update currentJob if it matches
      const { currentJob } = get();
      if (currentJob && (currentJob._id === id || currentJob.id === id)) {
        set({ currentJob: { ...currentJob, status } });
      }

      return response;
    } catch (error) {
      console.error('Error updating job status:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteJobPosting: async (id) => {
    try {
      set({ isLoading: true });
      await JobPostService.delete({ id });
      // Refresh the list after successful deletion
      const { pagination } = get();
      await get().fetchJobPostings(pagination.page, pagination.limit);
    } catch (error) {
      console.error('Error deleting job posting:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  currentJob: null,

  getJobPosting: async (id) => {
    try {
      const { jobPostings } = get();
      const existingJob = jobPostings.find(job => job._id === id || job.id === id);

      if (existingJob) {
        set({ currentJob: existingJob, isLoading: false });
        // Optional: still fetch in background to update
        // return; 
      }

      set({ isLoading: !existingJob, currentJob: existingJob || null });
      const response = await JobPostService.get({ id });
      if (response.data && response.data.data) {
        set({ currentJob: response.data.data });
      }
      return response;
    } catch (error) {
      console.error('Error fetching job details:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));
