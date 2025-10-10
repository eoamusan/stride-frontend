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
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({
        data: state.data ? state.data : null,
      }),
    }
  )
);
