import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AuthService from '@/api/auth';

export const useUserStore = create(
  persist(
    (set, get) => ({
      data: null,
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
        } catch (error) {
          set({
            message:
              error.response?.data?.message ||
              error.message ||
              'Registration failed. Please try again.',
            isLoading: false,
          });
          throw error;
        }
      },

      async login(data) {},
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({
        data: state.data ? state.data : null,
      }),
    }
  )
);
