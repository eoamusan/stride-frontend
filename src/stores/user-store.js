import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AuthService from '@/api/auth';
import BusinessService from '@/api/business';
import ProfileService from '@/api/profile';

export const useUserStore = create(
  persist(
    (set) => ({
      data: null,
      isLoading: false,
      message: null,
      activeBusiness: null,
      profile: null,
      allBusinesses: [],

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

      async refresh() {
        try {
          const { data } = useUserStore.getState();
          if (!data?.refreshToken) {
            throw new Error('No refresh token available');
          }

          const { data: res } = await AuthService.refresh(data.refreshToken);

          // Update only the access token, keep other data
          set({
            data: {
              ...data,
              accessToken: res.data.accessToken,
            },
          });

          return res.data.accessToken;
        } catch (err) {
          // If refresh fails, clear everything
          set({
            data: null,
            activeBusiness: null,
            allBusinesses: [],
            message: 'Session expired. Please login again.',
          });
          throw err;
        }
      },

      async getUserProfile() {
        try {
          const { data: res } = await ProfileService.fetch();
          set({ profile: res.data });
          return res.data;
        } catch (err) {
          console.error('Error fetching user profile:', err);
          throw err;
        }
      },

      async getBusinessData() {
        try {
          const { data: res } = await BusinessService.fetch();
          const businesses = res.data || [];

          // Check if there's a business with switchActive === true
          let activeBusiness = businesses.find(
            (business) => business.switchActive === true
          );

          // If no active business found, switch to the first business
          if (!activeBusiness && businesses.length > 0) {
            const firstBusiness = businesses[0];

            try {
              const { data: switchRes } = await BusinessService.switch({
                id: firstBusiness._id,
              });

              // Use the switch response directly as the active business
              activeBusiness = switchRes.data;

              // Update the businesses array with the switched business
              const updatedBusinesses = businesses.map((business) =>
                business._id === activeBusiness._id
                  ? { ...business, switchActive: true }
                  : { ...business, switchActive: false }
              );

              set({ activeBusiness, allBusinesses: updatedBusinesses });
              return activeBusiness;
            } catch (switchErr) {
              console.error('Error switching business:', switchErr);
              // If switch fails, fall back to first business without switchActive
              activeBusiness = firstBusiness;
              set({ activeBusiness, allBusinesses: businesses });
              throw new Error(
                switchErr.response?.data?.message ||
                  'Failed to activate business'
              );
            }
          }

          set({ activeBusiness, allBusinesses: businesses });
          return activeBusiness;
        } catch (err) {
          console.error('Error fetching business data:', err);
          throw err;
        }
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
        profile: state.profile ? state.profile : null,
        activeBusiness: state.activeBusiness ? state.activeBusiness : null,
        allBusinesses: state.allBusinesses ? state.allBusinesses : [],
      }),
    }
  )
);
