import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AuthService from '@/api/auth';
import BusinessService from '@/api/business';

export const useUserStore = create(
  persist(
    (set) => ({
      data: null,
      businessData: null,
      isLoading: false,
      message: null,

      async register(data) {
        try {
          set({ isLoading: true });
          const { data: res } = await AuthService.register(data);
          set({
            data: res.data,
            message: res.data?.message || 'Registration successful',
            isLoading: false,
          });
        } catch (err) {
          set({
            message:
              err.response?.data?.message ||
              err.message ||
              'Registration failed. Please try again.',
            isLoading: false,
          });
          throw err;
        }
      },

      async login(data) {
        try {
          set({ isLoading: true });
          const { data: res } = await AuthService.login(data);
          set({
            data: res.data,
            message: 'Login successful',
            isLoading: false,
          });
          return res.data;
        } catch (err) {
          set({
            message:
              err.response?.data?.message ||
              err.message ||
              'Login Failed. Please try again.',
            isLoading: false,
          });
          throw err;
        }
      },

      async refresh() {},

      async getBusinessData() {
        const { data: res } = await BusinessService.fetch();
        set({ businessData: res.data[0] });
        return res.data[0];
      },

      logout() {
        // Clear user data from store
        set({
          data: null,
          isLoading: false,
          message: null,
        });

        // Clear persisted storage
        localStorage.removeItem('user-storage');
      },
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({
        data: state.data ? state.data : null,
        businessData: state.businessData ? state.businessData : null,
      }),
    }
  )
);
