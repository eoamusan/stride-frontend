import axiosInstance from '@/lib/axios';
import { useUserStore } from '@/stores/user-store';

export default class SecurityService {
  static async mfa({ mfaEnabled }) {
    const userStore = useUserStore.getState();
    const response = await axiosInstance.post(
      'auth/mfa',
      { accountId: userStore.data?.account?._id, mfaEnabled },
      {
        headers: {
          Authorization: `Bearer ${userStore.data?.accessToken}`,
        },
      }
    );
    return response;
  }

  static async startSecurity() {
    const userStore = useUserStore.getState();
    const response = await axiosInstance.post(
      `auth/security`,
      {
        accountId: userStore.data?.account?._id,
      },
      {
        headers: {
          Authorization: `Bearer ${userStore.data?.accessToken}`,
        },
      }
    );
    return response;
  }

  static async completeSecurity({ data }) {
    const userStore = useUserStore.getState();
    const response = await axiosInstance.post(`auth/complete-security`, data, {
      headers: {
        Authorization: `Bearer ${userStore.data?.accessToken}`,
      },
    });
    return response;
  }
}
