import { create } from 'zustand';
import AuthService from '@/api/auth';

const useUserStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem('api-token') || null,
  loading: false,
  error: null,

  login: async (data) => {
    set({ loading: true, error: null });
    try {
      const { token } = await AuthService.login(data);
      localStorage.setItem('api-token', token);
      set({ token, loading: false });
    } catch (err) {
      set({ error: err.message || 'Login failed', loading: false });
    }
  },
}));
